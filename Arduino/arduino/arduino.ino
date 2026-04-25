#include <DHT.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <Servo.h>

// --- Настройки на пиновете (Pin Settings) ---
#define DHTPIN D1      
#define DHTTYPE DHT11
#define SOIL_PIN A0    // Пин за почвата (Soil pin)

// ВАЖНО: Преместихме WATER_PIN на D6, защото Сервото вече е на D5!
#define SERVO_PIN D5   // <-- Новият пин за сервото

// --- Настройки за поливането (Watering Settings) ---
const int DRY_SOIL_THRESHOLD = 20; // Процентът, при който се задейства сервото
// --- WiFi и Сървър настройки ---  
const char* ssid = "bob";
const char* password = "12345678";
const char* serverURL = "http://10.210.46.104:5500/receive";

// --- Инициализация на обектите ---
DHT dht(DHTPIN, DHTTYPE);
Servo myServo; // Създаваме обекта за сервото

void setup() {
  Serial.begin(9600);
  delay(100);
  Serial.println("\n[Система] Инициализация...");
  //Стартираме WiFi
  WiFi.mode(WIFI_STA); // Задаваме режим Station за правилен MAC адрес (Set Station mode)
  WiFi.begin(ssid, password);
  Serial.print("[WiFi] Свързване към ");
  Serial.print(ssid);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n[WiFi] Успешно свързване! IP: " + WiFi.localIP().toString());
  Serial.println("[WiFi] MAC Адрес: " + WiFi.macAddress());

  //Стартиране на сензорите
  dht.begin();

  Serial.println("[Система] Всички модули са готови!\n");
}

void loop() {
  // Даваме време на DHT11 да се подготви
  delay(3000);
  
  // --- Четене на dht ---
  float dhtTemp = dht.readTemperature();
  float dhtHum = dht.readHumidity();

  // Четене на почвата (Soil Moisture)
  int rawMoisture = analogRead(SOIL_PIN);
  int moisturePercent = map(rawMoisture, 15, 700, 0, 100); 
  
  // Ограничаваме процентите между 0 и 100, за да няма бъгове (150% или -10%)
  moisturePercent = constrain(moisturePercent, 0, 100);

  if (isnan(dhtTemp)) dhtTemp = 0.0;
  if (isnan(dhtHum)) dhtHum = 0.0;
  // --- Принтиране в Serial Monitor ---
  Serial.println("┌──────────────────────────────────┐");
  Serial.printf("│ Температура: %.2f °C            │\n", dhtTemp);
  Serial.printf("│ Влажност:    %.2f %%            │\n", dhtHum);
  Serial.printf("│ Влажност почва: %d %%           │\n", moisturePercent);
  Serial.println("├──────────────────────────────────┤");
  Serial.println("└──────────────────────────────────┘");

  // --- Създаване на JSON ---
  String jsonPayload = "{";
  jsonPayload += "\"mac_address\":\"" + WiFi.macAddress() + "\",";
  jsonPayload += "\"dht_temp\":" + String(dhtTemp) + ",";
  jsonPayload += "\"dht_hum\":" + String(dhtHum) + ",";
  jsonPayload += "\"soil_moisture\":" + String(moisturePercent) + ","; 
  jsonPayload += "\"water_detected\":" + String("false");
  jsonPayload += "}";
  
  if(sendDataToServer(jsonPayload)){
    //ESP.deepSleep(30000000);
    delay(20000);
  }
}
int sendDataToServer(String jsonPayload) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    
    http.begin(client, serverURL);
    http.addHeader("Content-Type", "application/json");
    
    int httpResponseCode = http.POST(jsonPayload);
    
    if (httpResponseCode > 0) {
      Serial.printf("[Сървър] Изпратено успешно. Код: %d\n\n", httpResponseCode);
      http.end();
      return 1;
    } else {
      Serial.printf("[Грешка] HTTP POST се провали. Код: %d\n\n", httpResponseCode);
      http.end();
      return 0;
    }
    
  } else {
    Serial.println("[Грешка] WiFi връзката е разпадната! Опит за реконект...");
    WiFi.begin(ssid, password); 
    return 0;
  }
}
