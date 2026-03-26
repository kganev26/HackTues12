#include <DHT.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

// --- Настройки на пиновете ---
#define DHTPIN D4     
#define DHTTYPE DHT11
#define WATER_PIN D5

// --- WiFi и Сървър настройки ---
const char* ssid = "Daniel's S24";
const char* password = "BatManSavage1976";
const char* serverURL = "http://10.35.212.104:5500/cardnum";
// --- Инициализация на сензорите ---
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  delay(100);
  Serial.println("\n[Система] Инициализация...");

  // 1. Стартиране на WiFi
  WiFi.begin(ssid, password);
  Serial.print("[WiFi] Свързване към ");
  Serial.print(ssid);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n[WiFi] Успешно свързване! IP: " + WiFi.localIP().toString());

  // 2. Стартиране на сензорите
  dht.begin();
  pinMode(WATER_PIN, INPUT);

  Serial.println("[Система] Всички модули са готови!\n");
}

void loop() {
  // --- Четене на сензорите ---
  float dhtTemp = dht.readTemperature();
  float dhtHum = dht.readHumidity();
  bool waterDetected = (digitalRead(WATER_PIN) == HIGH);

  // Защита: Ако DHT върне грешка (NaN), записваме 0, за да не счупим JSON-а
  if (isnan(dhtTemp)) dhtTemp = 0.0;
  if (isnan(dhtHum)) dhtHum = 0.0;

  // --- Принтиране в Серийния монитор ---
  Serial.println("┌──────────────────────────────────┐");
  Serial.printf("│ Температура: %.2f °C            │\n", dhtTemp);
  Serial.printf("│ Влажност:    %.2f %%            │\n", dhtHum);
  Serial.println("├──────────────────────────────────┤");
  Serial.printf("│ Вода: %-26s │\n", waterDetected ? "ЗАСЕЧЕНА ⚠" : "СУХО");
  Serial.println("└──────────────────────────────────┘");

  // --- Създаване на JSON с реалните данни ---
  String jsonPayload = "{";
  jsonPayload += "\"dht_temp\":" + String(dhtTemp) + ",";
  jsonPayload += "\"dht_hum\":" + String(dhtHum) + ",";
  jsonPayload += "\"water_detected\":" + String(waterDetected ? "true" : "false");
  jsonPayload += "}";

  // --- Изпращане към сървъра ---
  sendDataToServer(jsonPayload);

  // Изчакваме 5 секунди преди следващото четене/изпращане
  delay(5000); 
}

// --- Функция за изпращане на данните ---
void sendDataToServer(String jsonPayload) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    
    http.begin(client, serverURL);
    http.addHeader("Content-Type", "application/json");
    
    int httpResponseCode = http.POST(jsonPayload);
    
    Serial.print("[Сървър] Изпращане: ");
    Serial.println(jsonPayload);
    
    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.printf("[Сървър] Отговор (Код %d): %s\n\n", httpResponseCode, response.c_str());
    } else {
      Serial.printf("[Грешка] HTTP POST се провали. Код на грешка: %d\n\n", httpResponseCode);
    }
    
    http.end();
  } else {
    Serial.println("[Грешка] WiFi връзката е разпадната! Опит за реконект...");
    WiFi.begin(ssid, password); 
  }
}