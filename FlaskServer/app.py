from flask import Flask, request, jsonify
from flask_cors import CORS
import psycopg2
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

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
            password_hash VARCHAR(255) NOT NULL
        );

''')
    # Turn it into a high-speed TimescaleDB hypertable
    cur.execute("SELECT create_hypertable('sensor_data', 'time', if_not_exists => TRUE);")
    
    conn.commit()
    cur.close()
    conn.close()

init_db()

# Същият маршрут, към който NodeMCU изпраща данните
@app.route('/cardnum', methods=['POST'])
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
            
        # Принтираме ги красиво в конзолата на сървъра
        print("\n" + "="*40)
        print("🌍 НОВИ МЕТЕОРОЛОГИЧНИ ДАННИ ПОЛУЧЕНИ 🌍")
        print("="*40)
        print(f"🌡️  Температура:     {dht_t} °C")
        print(f"💧  Влажност:        {dht_h} %")
        print(f"⚠️  Сензор за вода:  {'ЗАСЕЧЕНА ВОДА!' if water else 'Сухо'}")
        print("="*40 + "\n")

        # Save to database
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('INSERT INTO sensor_data (time, temperature, moisture) VALUES (%s, %s, %s)',
                (datetime.now(), dht_t, dht_h))
        conn.commit()
        cur.close()
        conn.close()

        # Hackathon Alert Logic!
        if dht_h < 20:
            print(f"🚨 AI ALERT: Soil moisture critically low at {dht_h}%! Triggering water system...")

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
        return jsonify({'error': 'Username and password are required!'}), 400

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
        
        new_user_id = cur.fetchone()[0] # Grab the new ID so the frontend knows who they are
        conn.commit()
        print("Successfuly added new user")
        return jsonify({'status': 'success', 'user_id': new_user_id, 'message': 'Farmer registered!'}), 201
    
        
    except psycopg2.errors.UniqueViolation:
        # This catches if someone tries to use a username that already exists
        conn.rollback()
        return jsonify({'message': 'Username already taken.'}), 409
        
    finally:
        cur.close()
        conn.close()

if __name__ == '__main__':
    # Стартираме сървъра на порт 5500 и слушаме от всички IP-та (0.0.0.0)
    print("🚀 Flask сървърът стартира! Чакам данни от NodeMCU на порт 5500...")
    app.run(host='0.0.0.0', port=5500, debug=True)

