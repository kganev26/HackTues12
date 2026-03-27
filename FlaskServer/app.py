from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
import os
import json
import base64
from dotenv import load_dotenv

load_dotenv()
import re
import psycopg2
import datetime
import jwt
from werkzeug.security import generate_password_hash, check_password_hash
from google import genai
from google.genai import types
from pywebpush import webpush, WebPushException
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import serialization

MAC_REGEX = re.compile(r'^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$')

app = Flask(__name__)
CORS(app)

JWT_SECRET = os.getenv("JWT_SECRET", "dev-only-default")
JWT_ALGORITHM = "HS256"
JWT_EXP_DELTA_MINUTES = 60

# ── VAPID keys for Web Push ──────────────────────────────────────────
VAPID_KEY_FILE = os.path.join(os.path.dirname(__file__), "vapid_private.pem")
VAPID_CLAIMS = {"sub": "mailto:gaia@smartfarm.local"}

def _load_or_generate_vapid():
    if os.path.exists(VAPID_KEY_FILE):
        with open(VAPID_KEY_FILE, "rb") as f:
            private_key = serialization.load_pem_private_key(f.read(), password=None)
    else:
        private_key = ec.generate_private_key(ec.SECP256R1())
        pem = private_key.private_bytes(
            serialization.Encoding.PEM,
            serialization.PrivateFormat.PKCS8,
            serialization.NoEncryption(),
        )
        with open(VAPID_KEY_FILE, "wb") as f:
            f.write(pem)
        print(f"Generated new VAPID key → {VAPID_KEY_FILE}")

    raw_pub = private_key.public_key().public_bytes(
        serialization.Encoding.X962,
        serialization.PublicFormat.UncompressedPoint,
    )
    pub_b64 = base64.urlsafe_b64encode(raw_pub).rstrip(b"=").decode()
    return pub_b64

VAPID_PUBLIC_KEY_B64 = _load_or_generate_vapid()


def create_jwt_token(user_id, username):
    payload = {
        "user_id": user_id,
        "username": username,
        "exp": datetime.datetime.now(datetime.UTC) + datetime.timedelta(minutes=JWT_EXP_DELTA_MINUTES)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def get_db_connection():
    return psycopg2.connect(
        host=os.environ.get('DB_HOST', 'localhost'),
        database='smartfarm',
        user='farm_admin',
        password='hackathon_password'
    )

def init_db():
    conn = get_db_connection()
    cur = conn.cursor()

    cur.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            firstname VARCHAR(50) NOT NULL,
            lastname VARCHAR(50) NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            mac_address VARCHAR(17) UNIQUE
        );
    ''')
    cur.execute('''
        CREATE TABLE IF NOT EXISTS sensor_data (
            time TIMESTAMP NOT NULL,
            temperature REAL NOT NULL,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            humidity REAL NOT NULL,
            soil_moisture REAL NOT NULL,
            water_detected BOOLEAN DEFAULT FALSE
        );
    ''')
    cur.execute("SELECT create_hypertable('sensor_data', 'time', if_not_exists => TRUE);")

    cur.execute('''
        CREATE TABLE IF NOT EXISTS push_subscriptions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            endpoint TEXT UNIQUE NOT NULL,
            subscription JSONB NOT NULL,
            created_at TIMESTAMP DEFAULT NOW()
        );
    ''')

    cur.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS agriculture VARCHAR(500);")
    cur.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS country VARCHAR(100);")
    cur.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS province VARCHAR(100);")
    cur.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS gender VARCHAR(20);")
    cur.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS birthyear VARCHAR(4);")

    conn.commit()
    cur.close()
    conn.close()

init_db()

def decode_jwt_token(token):
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])

def get_user_id_from_request():
    """Extract and validate JWT, return user_id or raise."""
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None, jsonify({'message': 'Missing or invalid token'}), 401
    try:
        payload = decode_jwt_token(auth_header.split(' ', 1)[1])
        return payload['user_id'], None, None
    except jwt.ExpiredSignatureError:
        return None, jsonify({'message': 'Token expired'}), 401
    except jwt.InvalidTokenError:
        return None, jsonify({'message': 'Invalid token'}), 401


def check_and_notify(user_id, temp, humidity, soil_moisture, water_detected):
    """Check sensor thresholds and send push notifications."""
    alerts = []
    if temp is not None and temp > 40:
        alerts.append(f'High temperature: {temp:.1f}\u00b0C')
    if temp is not None and temp < 5:
        alerts.append(f'Low temperature: {temp:.1f}\u00b0C')
    if humidity is not None and humidity < 20:
        alerts.append(f'Low humidity: {humidity:.1f}%')
    if soil_moisture is not None and soil_moisture < 20:
        alerts.append(f'Low soil moisture: {soil_moisture:.1f}%')
    if soil_moisture is not None and soil_moisture > 80:
        alerts.append(f'High soil moisture: {soil_moisture:.1f}%')
    if water_detected:
        alerts.append('Water detected on sensor!')

    if not alerts:
        return

    payload = json.dumps({
        'title': 'GAIA Farm Alert',
        'body': '\n'.join(alerts),
        'url': '/sensors',
    })

    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            'SELECT id, subscription FROM push_subscriptions WHERE user_id = %s',
            (user_id,),
        )
        rows = cur.fetchall()

        expired_ids = []
        for sub_id, sub_info in rows:
            try:
                webpush(
                    subscription_info=sub_info,
                    data=payload,
                    vapid_private_key=VAPID_KEY_FILE,
                    vapid_claims=VAPID_CLAIMS,
                )
            except WebPushException as e:
                if e.response is not None and e.response.status_code in (404, 410):
                    expired_ids.append(sub_id)
                else:
                    print(f"Push failed for sub {sub_id}: {e}")

        if expired_ids:
            cur.execute(
                'DELETE FROM push_subscriptions WHERE id = ANY(%s)', (expired_ids,)
            )
            conn.commit()
    except Exception as e:
        print(f"Notification error: {e}")
    finally:
        cur.close()
        conn.close()


@app.route('/receive', methods=['POST'])
def receive_data():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"status": "error", "message": "No JSON payload provided"}), 400

        mac_addr = data.get('mac_address')
        dht_t = data.get('dht_temp')
        dht_h = data.get('dht_hum')
        soil = data.get('soil_moisture')
        water = data.get('water_detected', False)


        if not mac_addr or dht_t is None or dht_h is None:
            return jsonify({'error': 'Missing data'}), 400

        conn = get_db_connection()
        try:
            cur = conn.cursor()

            cur.execute('SELECT id FROM users WHERE mac_address = %s;', (mac_addr,))
            user = cur.fetchone()

            if not user:
                return jsonify({'error': 'Device not registered', 'sleep_multiplier': 5}), 401

            user_id = user[0]

            cur.execute('INSERT INTO sensor_data (time, temperature, user_id, humidity, soil_moisture, water_detected) VALUES (%s, %s, %s, %s, %s, %s)',
                    (datetime.datetime.now(datetime.UTC), dht_t, user_id, dht_h, soil, water))
            conn.commit()
        finally:
            cur.close()
            conn.close()

        # Check thresholds and push notifications
        check_and_notify(user_id, dht_t, dht_h, soil, water)

        return jsonify({"status": "success", "message": "Data received and parsed!"}), 200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/display', methods=['GET'])
def get_history():
    user_id, err_response, err_code = get_user_id_from_request()
    if err_response:
        return err_response, err_code

    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute('''
            SELECT time, temperature, moisture
            FROM sensor_data
            WHERE user_id = %s
            ORDER BY time DESC
            LIMIT 15;
        ''', (user_id,))
        rows = cur.fetchall()
    finally:
        cur.close()
        conn.close()

    data_list = [{'time': r[0].strftime('%H:%M:%S'), 'temp': r[1], 'moisture': r[2]} for r in rows]
    data_list.reverse()
    return jsonify(data_list), 200


@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    firstname = data.get('firstname')
    lastname = data.get('lastname')
    agriculture = data.get('agriculture') or None
    country = data.get('country') or None
    province = data.get('province') or None

    if not username or not password or not firstname or not lastname:
        return jsonify({'message': 'Username and password are required!'}), 400

    hashed_password = generate_password_hash(password)

    conn = get_db_connection()
    cur = conn.cursor()

    try:
        cur.execute('''
            INSERT INTO users (username, firstname, lastname, password_hash, agriculture, country, province)
            VALUES (%s, %s, %s, %s, %s, %s, %s) RETURNING id;
        ''', (username, firstname, lastname, hashed_password, agriculture, country, province))

        new_user_id = cur.fetchone()[0]
        conn.commit()

        token = create_jwt_token(new_user_id, username)
        user_obj = {
            'id': new_user_id,
            'username': username,
            'firstname': firstname,
            'lastname': lastname,
            'mac_address': None,
            'agriculture': agriculture,
            'country': country,
            'province': province,
            'gender': None,
            'birthyear': None,
        }

        return jsonify({'token': token, 'user': user_obj}), 201

    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        return jsonify({'message': 'Username already taken.'}), 409

    finally:
        cur.close()
        conn.close()


@app.route('/login', methods=['POST'])
def login_user():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password are required!'}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute(
        'SELECT id, username, firstname, lastname, password_hash, mac_address, agriculture, country, province, gender, birthyear FROM users WHERE username=%s',
        (username,)
    )
    user_row = cur.fetchone()
    cur.close()
    conn.close()

    if not user_row:
        return jsonify({'message': 'Invalid credentials'}), 401

    user_id, username_db, firstname_db, lastname_db, password_hash_db, mac_address_db, agriculture_db, country_db, province_db, gender_db, birthyear_db = user_row

    if not check_password_hash(password_hash_db, password):
        return jsonify({'message': 'Invalid credentials'}), 401

    token = create_jwt_token(user_id, username_db)
    user_obj = {
        'id': user_id,
        'username': username_db,
        'firstname': firstname_db,
        'lastname': lastname_db,
        'mac_address': mac_address_db,
        'agriculture': agriculture_db,
        'country': country_db,
        'province': province_db,
        'gender': gender_db,
        'birthyear': birthyear_db,
    }

    return jsonify({'token': token, 'user': user_obj}), 200


@app.route('/profile', methods=['GET'])
def get_profile():
    user_id, err_response, err_code = get_user_id_from_request()
    if err_response:
        return err_response, err_code

    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            'SELECT id, username, firstname, lastname, mac_address, agriculture, country, province, gender, birthyear FROM users WHERE id=%s',
            (user_id,)
        )
        row = cur.fetchone()
    finally:
        cur.close()
        conn.close()

    if not row:
        return jsonify({'message': 'User not found'}), 404

    return jsonify({
        'id': row[0],
        'username': row[1],
        'firstname': row[2],
        'lastname': row[3],
        'mac_address': row[4],
        'agriculture': row[5],
        'country': row[6],
        'province': row[7],
        'gender': row[8],
        'birthyear': row[9],
    }), 200


@app.route('/user/mac', methods=['PATCH'])
def update_mac():
    user_id, err_response, err_code = get_user_id_from_request()
    if err_response:
        return err_response, err_code

    mac = request.json.get('mac_address', '').strip()

    if mac and not MAC_REGEX.match(mac):
        return jsonify({'message': 'Invalid MAC address format. Expected XX:XX:XX:XX:XX:XX'}), 400

    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            'UPDATE users SET mac_address=%s WHERE id=%s',
            (mac if mac else None, user_id)
        )
        conn.commit()
    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        return jsonify({'message': 'MAC address already in use'}), 409
    finally:
        cur.close()
        conn.close()

    return jsonify({'mac_address': mac if mac else None}), 200


@app.route('/user/mac', methods=['DELETE'])
def remove_mac():
    user_id, err_response, err_code = get_user_id_from_request()
    if err_response:
        return err_response, err_code

    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute('UPDATE users SET mac_address = NULL WHERE id = %s', (user_id,))
        conn.commit()
    finally:
        cur.close()
        conn.close()

    return jsonify({'message': 'MAC address removed'}), 200


@app.route('/chat', methods=['POST'])
def chat():
    user_message = (request.json or {}).get('message', '').strip()
    if not user_message:
        return jsonify({'message': 'No message provided'}), 400
    
    
    user_id, err_response, err_code = get_user_id_from_request()
    if err_response:
        system_prompt = f"You are GAIA, an AI farming assistant helping a random user, not signed in.\n"
        system_prompt += "The user is bulgarian, so use bulgarian as your default language\n"
        api_key = os.environ.get('GEMINI_API_KEY')
        if not api_key:
            return jsonify({'message': 'AI service not configured (missing GEMINI_API_KEY)'}), 503

        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=user_message,
            config=types.GenerateContentConfig(
            system_instruction=system_prompt,
            tools=[types.Tool(google_search=types.GoogleSearch())]
            ),
        )
        return jsonify({'reply': response.text}), 200

    

    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute(
            'SELECT username, firstname, lastname, agriculture, country, province, gender, birthyear FROM users WHERE id=%s',
            (user_id,)
        )
        user_row = cur.fetchone()
        cur.execute('''
            SELECT time, temperature, humidity, soil_moisture, water_detected FROM sensor_data
            WHERE user_id = %s ORDER BY time DESC LIMIT 20
        ''', (user_id,))
        sensor_rows = cur.fetchall()
    finally:
        cur.close()
        conn.close()

    if not user_row:
        return jsonify({'message': 'User not found'}), 404

    username, firstname, lastname, agriculture, country, province, gender, birthyear = user_row

    system_prompt = f"You are GAIA, an AI farming assistant helping {firstname} {lastname} (@{username}).\n"
    system_prompt += "Farm profile:\n"
    system_prompt += f"- Agriculture: {agriculture or 'Not specified'}\n"
    system_prompt += f"- Location: {', '.join(filter(None, [province, country])) or 'Not specified'}\n"
    system_prompt += f"- Gender: {gender or 'Not specified'}\n"
    system_prompt += f"- Birth year: {birthyear or 'Not specified'}\n\n"
    system_prompt += "The user is bulgarian, so use bulgarian as your default language\n"
    system_prompt += "Recent sensor readings (newest first):\n"
    

    if sensor_rows:
        for r in sensor_rows:
            temp = f"{r[1]:.1f}°C" if r[1] is not None else "N/A"
            moist = f"{r[2]:.1f}%" if r[2] is not None else "N/A"
            system_prompt += f"  {r[0].strftime('%Y-%m-%d %H:%M')} | Temp: {temp} | Moisture: {moist}\n"
    else:
        system_prompt += "  No sensor data available yet.\n"

    system_prompt += "\nGive concise, practical farming advice based on their data."

    api_key = os.environ.get('GEMINI_API_KEY')
    if not api_key:
        return jsonify({'message': 'AI service not configured (missing GEMINI_API_KEY)'}), 503

    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=user_message,
        config=types.GenerateContentConfig(
            system_instruction=system_prompt,
            tools=[types.Tool(google_search=types.GoogleSearch())]
        ),
    )
    return jsonify({'reply': response.text}), 200


@app.route('/vapid-public-key', methods=['GET'])
def vapid_public_key():
    return jsonify({'publicKey': VAPID_PUBLIC_KEY_B64}), 200


@app.route('/subscribe', methods=['POST'])
def subscribe_push():
    user_id, err_response, err_code = get_user_id_from_request()
    if err_response:
        return err_response, err_code

    subscription = (request.json or {}).get('subscription')
    if not subscription or 'endpoint' not in subscription:
        return jsonify({'message': 'Invalid subscription'}), 400

    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute('''
            INSERT INTO push_subscriptions (user_id, endpoint, subscription)
            VALUES (%s, %s, %s)
            ON CONFLICT (endpoint) DO UPDATE SET
                user_id = EXCLUDED.user_id,
                subscription = EXCLUDED.subscription,
                created_at = NOW()
        ''', (user_id, subscription['endpoint'], json.dumps(subscription)))
        conn.commit()
    finally:
        cur.close()
        conn.close()

    return jsonify({'message': 'Subscribed'}), 201


@app.route('/user/profile', methods=['PATCH'])
def update_profile():
    user_id, err_response, err_code = get_user_id_from_request()
    if err_response:
        return err_response, err_code

    data = request.json or {}
    ALLOWED = {'gender', 'birthyear'}
    updates = {k: v for k, v in data.items() if k in ALLOWED}
    if not updates:
        return jsonify({'message': 'No valid fields to update'}), 400

    set_clause = ', '.join(f"{k} = %s" for k in updates)
    values = list(updates.values()) + [user_id]

    conn = get_db_connection()
    try:
        cur = conn.cursor()
        cur.execute(f'UPDATE users SET {set_clause} WHERE id = %s', values)
        conn.commit()
    finally:
        cur.close()
        conn.close()

    return jsonify(updates), 200


if __name__ == '__main__':
    print("Flask server starting on port 5500...")
    app.run(host='0.0.0.0', port=5500, debug=True)
