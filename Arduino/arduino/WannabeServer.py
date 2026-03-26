from flask import Flask, request, jsonify

app = Flask(__name__)

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

        # Връщаме успешен отговор към NodeMCU
        return jsonify({"status": "success", "message": "Data received and parsed!"}), 200

    except Exception as e:
        print(f"Грешка при обработката: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    # Стартираме сървъра на порт 5500 и слушаме от всички IP-та (0.0.0.0)
    print("🚀 Flask сървърът стартира! Чакам данни от NodeMCU на порт 5500...")
    app.run(host='0.0.0.0', port=5500, debug=True)