"""
Seed script: generates 7 days of realistic mock sensor data
and inserts it into TimescaleDB for Grafana visualization.

Run once after the DB is up:
    python seed_mock_data.py
"""

import psycopg2
import datetime
import random
import math


DB_CONFIG = {
    "host": "localhost",
    "database": "smartfarm",
    "user": "farm_admin",
    "password": "hackathon_password",
    "port": 5432,
}

INTERVAL_MINUTES = 5
DAYS_BACK = 7


def ensure_columns(cur):
    # Drop NOT NULL on legacy column so old rows aren't required
    cur.execute("ALTER TABLE sensor_data ALTER COLUMN moisture DROP NOT NULL;")
    cur.execute("ALTER TABLE sensor_data ADD COLUMN IF NOT EXISTS humidity REAL;")
    cur.execute("ALTER TABLE sensor_data ADD COLUMN IF NOT EXISTS soil_moisture REAL;")
    cur.execute("ALTER TABLE sensor_data ADD COLUMN IF NOT EXISTS water_detected BOOLEAN DEFAULT FALSE;")


def generate_records():
    end_time = datetime.datetime.now(datetime.UTC)
    start_time = end_time - datetime.timedelta(days=DAYS_BACK)

    records = []
    current_time = start_time
    soil = 72.0  # starting soil moisture %

    while current_time <= end_time:
        hour = current_time.hour + current_time.minute / 60.0

        # Temperature: 18–32 °C, peaks around 14:00
        temp = 25 + 7 * math.sin((hour - 6) * math.pi / 12) + random.gauss(0, 0.8)
        temp = round(max(14.0, min(40.0, temp)), 1)

        # Humidity: inverse of temperature, 40–85 %
        humidity = 65 - 18 * math.sin((hour - 6) * math.pi / 12) + random.gauss(0, 2)
        humidity = round(max(30.0, min(95.0, humidity)), 1)

        # Soil moisture: drains ~0.1 %/5 min, watered when it drops below 30 %
        soil -= 0.1 + random.gauss(0, 0.04)
        water_detected = False
        if soil < 30.0:
            soil = 72.0 + random.gauss(0, 4)
            water_detected = True
        elif random.random() < 0.003:   # rare spontaneous water event
            water_detected = True

        soil = round(max(0.0, min(100.0, soil)), 1)

        records.append((current_time, temp, humidity, soil, water_detected))
        current_time += datetime.timedelta(minutes=INTERVAL_MINUTES)

    return records


def seed():
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()

    ensure_columns(cur)
    conn.commit()

    records = generate_records()

    cur.executemany(
        """
        INSERT INTO sensor_data (time, temperature, humidity, soil_moisture, water_detected, user_id)
        VALUES (%s, %s, %s, %s, %s, 6)
        """,
        records,
    )

    conn.commit()
    print(f"Inserted {len(records)} mock sensor records ({DAYS_BACK} days @ {INTERVAL_MINUTES}-min intervals).")

    cur.close()
    conn.close()


if __name__ == "__main__":
    seed()
