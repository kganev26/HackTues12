from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import psycopg2
from datetime import datetime, timedelta
import jwt
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

# Use an environment variable in production
JWT_SECRET = os.getenv("JWT_SECRET", "dev-only-default")
JWT_ALGORITHM = "HS256"
JWT_EXP_DELTA_MINUTES = 60


def create_jwt_token(user_id, username):
    payload = {
        "user_id": user_id,
        "username": username,
        "exp": datetime.utcnow() + timedelta(minutes=JWT_EXP_DELTA_MINUTES)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

def get_db_connection():
    return psycopg2.connect(
        host='localhost',
        database='smartfarm',
        user='farm_admin',
        password='hackathon_password'
    )

# 2. Automatically set up the tables if they don't exist
def init_db():
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Create the standard table
    cur.execute('''
        CREATE TABLE IF NOT EXISTS sensor_data (
            time TIMESTAMP NOT NULL,
            temperature REAL NOT NULL,
            moisture REAL NOT NULL
        );
    ''')
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
    # Turn it into a high-speed TimescaleDB hypertable
    cur.execute("SELECT create_hypertable('sensor_data', 'time', if_not_exists => TRUE);")
    
    conn.commit()
    cur.close()
    conn.close()

init_db()

# Същият маршрут, към който NodeMCU изпраща данните
@app.route('/recive', methods=['POST'])
def receive_data():
    try:
        # Взимаме JSON пакета от заявката
        data = request.get_json()
        
        if not data:
            return jsonify({"status": "error", "message": "No JSON payload provided"}), 400

        # Извличаме конкретните стойности (само DHT и вода)
        dht_t = data.get('dht_temp', 'N/A')
        dht_h = data.get('dht_hum', 'N/A')
        water = data.get('water_detected', False)
        #mac_addr = data.get('mac_addr', 'N/A')
            
        #if not mac_addr or dht_t is None or dht_h is None:
        #    return jsonify({'error': 'Missing data'}), 400

        # Save to database
        conn = get_db_connection()
        cur = conn.cursor()
        
        # 1. Lookup who owns this MAC address
        #cur.execute('SELECT id FROM users WHERE mac_address = %s;', (mac_addr,))
        #user = cur.fetchone()
        
        cur.execute('INSERT INTO sensor_data (time, temperature, moisture) VALUES (%s, %s, %s)',
                (datetime.now(), dht_t, dht_h))
        conn.commit()
        cur.close()
        conn.close()

        
        # Връщаме успешен отговор към NodeMCU
        return jsonify({"status": "success", "message": "Data received and parsed!"}), 200

    except Exception as e:
        print(f"Грешка при обработката: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

# 4. The API Endpoint to READ the data (For your Dashboard or AI)
@app.route('/display', methods=['GET'])
def get_history():
    conn = get_db_connection()
    cur = conn.cursor()
    
    # Query Postgres: Get the 15 most recent readings, newest first
    cur.execute('''
        SELECT time, temperature, moisture 
        FROM sensor_data 
        ORDER BY time DESC 
        LIMIT 15;
    ''')
    
    rows = cur.fetchall()
    
    cur.close()
    conn.close()

    # Format the raw database rows into a clean JSON list
    data_list = []
    for row in rows:
        data_list.append({
            'time': row[0].strftime('%H:%M:%S'), # Just grabbing the hour/min/sec for a clean chart
            'temp': row[1],
            'moisture': row[2]
        })

    # Since we ordered DESC (newest first) to get the latest, 
    # we should reverse it so the oldest is on the left of our UI chart
    data_list.reverse()

    return jsonify(data_list), 200


@app.route('/register', methods=['POST'])
def register_user():
    data = request.json
    username = data.get('username')
    password = data.get('password') # The raw password from the frontend
    firstname = data.get('firstname')
    lastname = data.get('lastname')

    # 1. Basic check to make sure they didn't leave things blank
    if not username or not password or not firstname or not lastname:
        return jsonify({'message': 'Username and password are required!'}), 400

    # 2. THE SECURITY MAGIC: Hash the password
    hashed_password = generate_password_hash(password)

    # 3. Save it to the database
    conn = get_db_connection()
    cur = conn.cursor()
    
    try:
        cur.execute('''
            INSERT INTO users (username, firstname, lastname, password_hash) 
            VALUES (%s, %s, %s, %s) RETURNING id;
        ''', (username, firstname, lastname, hashed_password))

        new_user_id = cur.fetchone()[0]  # Grab the new ID so the frontend knows who they are
        conn.commit()

        token = create_jwt_token(new_user_id, username)
        user_obj = {
            'id': new_user_id,
            'username': username,
            'firstname': firstname,
            'lastname': lastname
        }

        print("Successfully added new user")
        return jsonify({'token': token, 'user': user_obj}), 201

    except psycopg2.errors.UniqueViolation:
        # This catches if someone tries to use a username that already exists
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
    cur.execute('SELECT id, username, firstname, lastname, password_hash FROM users WHERE username=%s', (username,))
    user_row = cur.fetchone()

    if not user_row:
        cur.close()
        conn.close()
        return jsonify({'message': 'Invalid credentials'}), 401

    user_id, username_db, firstname_db, lastname_db, password_hash_db = user_row

    if not check_password_hash(password_hash_db, password):
        cur.close()
        conn.close()
        return jsonify({'message': 'Invalid credentials'}), 401

    token = create_jwt_token(user_id, username_db)
    user_obj = {
        'id': user_id,
        'username': username_db,
        'firstname': firstname_db,
        'lastname': lastname_db
    }

    cur.close()
    conn.close()
    return jsonify({'token': token, 'user': user_obj}), 200


if __name__ == '__main__':
    # Стартираме сървъра на порт 5500 и слушаме от всички IP-та (0.0.0.0)
    print("🚀 Flask сървърът стартира! Чакам данни от NodeMCU на порт 5500...")
    app.run(host='0.0.0.0', port=5500, debug=True)

