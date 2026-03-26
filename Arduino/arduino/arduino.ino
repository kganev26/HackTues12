#include <DHT.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>

// --- Настройки на пиновете (Pin Settings) ---
#define DHTPIN D1      
#define DHTTYPE DHT11
#define WATER_PIN D5
#define BUZZER_PIN D2  // Лампа/Зумер
#define SOIL_PIN A0    // <-- Новият пин за почвата (New soil pin)

// --- WiFi и Сървър настройки ---  
const char* ssid = "Daniel's S24";
const char* password = "BatManSavage1976";
const char* serverURL = "http://10.35.212.104:5500/receive";

// --- Инициализация на сензорите ---
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  // 1. НАЙ-ПЪРВО: Принудително изключваме лампата
  pinMode(BUZZER_PIN, OUTPUT);
  digitalWrite(BUZZER_PIN, LOW); 

  Serial.begin(9600);
  delay(100);
  Serial.println("\n[Система] Инициализация...");

  // 2. След това стартираме WiFi
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

  // 3. Стартиране на сензорите
  dht.begin();
  pinMode(WATER_PIN, INPUT);

  Serial.println("[Система] Всички модули са готови!\n");
}

void loop() {
  // Даваме време на DHT11 да се подготви
  delay(2000); 

  // --- Четене на сензорите ---
  float dhtTemp = dht.readTemperature();
  float dhtHum = dht.readHumidity();
  bool waterDetected = (digitalRead(WATER_PIN) == HIGH);

  // Четене на почвата (Soil Moisture)
  int rawMoisture = analogRead(SOIL_PIN);
  int moisturePercent = map(rawMoisture, 1024, 350, 0, 100); 
  
  if (moisturePercent < 0) moisturePercent = 0;
  if (moisturePercent > 100) moisturePercent = 100;

  if (isnan(dhtTemp)) dhtTemp = 0.0;
  if (isnan(dhtHum)) dhtHum = 0.0;

  // --- ЛОГИКА ЗА ЛАМПАТА/ЗУМЕРА ---
  if (waterDetected) {
    digitalWrite(BUZZER_PIN, HIGH); 
  } else {
    digitalWrite(BUZZER_PIN, LOW);  
  }

  // --- Принтиране в Серийния монитор ---
  Serial.println("┌──────────────────────────────────┐");
  Serial.printf("│ Температура: %.2f °C            │\n", dhtTemp);
  Serial.printf("│ Влажност:    %.2f %%            │\n", dhtHum);
  Serial.printf("│ Влажност почва: %d %%           │\n", moisturePercent);
  Serial.println("├──────────────────────────────────┤");
  Serial.printf("│ Вода: %-26s │\n", waterDetected ? "ЗАСЕЧЕНА ⚠" : "СУХО");
  Serial.println("└──────────────────────────────────┘");

  // --- Създаване на JSON ---
  // Добавяме MAC адреса като стринг в началото на JSON-а
  String jsonPayload = "{";
  jsonPayload += "\"mac_address\":\"" + WiFi.macAddress() + "\",";
  jsonPayload += "\"dht_temp\":" + String(dhtTemp) + ",";
  jsonPayload += "\"dht_hum\":" + String(dhtHum) + ",";
  jsonPayload += "\"soil_moisture\":" + String(moisturePercent) + ","; 
  jsonPayload += "\"water_detected\":" + String(waterDetected ? "true" : "false");
  jsonPayload += "}";

  // Изчакваме 3 секунди преди изпращане
  delay(3000); 
  
  if(sendDataToServer(jsonPayload)){
    Serial.println("[Система] Заспиване (Deep Sleep) за 30 секунди...");
    // ВНИМАНИЕ: D0 трябва да е свързан към RST за да се събуди!
    ESP.deepSleep(300000); // 30 секунди в микросекунди (30,000,000)
  }
}

// --- Функция за изпращане на данните ---
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