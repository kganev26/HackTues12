#include <DHT.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>

#define DHTPIN D1 
#define DHTTYPE DHT11
#define SOIL_PIN A0 

const char* ssid = "S24";
const char* password = "BatManSavage1976";
// REPLACE with the IP Address printed by your Receiver!
const char* receiverIP = "10.61.251.141"; 
const unsigned int localPort = 4210; 
const char* serverURL = "http://10.210.46.104:5500/receive";

typedef struct struct_message {
    float dhtTemp;
    float dhtHum;
    int soilMoisture;
} struct_message;

struct_message myData;
WiFiUDP Udp;
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
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
  Serial.println("\n[Sender] Connected to WiFi");
  Udp.begin(localPort);
}

void loop() {
  myData.dhtTemp = dht.readTemperature();
  myData.dhtHum = dht.readHumidity();
  if (isnan(myData.dhtTemp)) myData.dhtTemp = 0.0;
  if (isnan(myData.dhtHum)) myData.dhtHum = 0.0;
  int rawMoisture = analogRead(SOIL_PIN);
  myData.soilMoisture = constrain(map(rawMoisture, 15, 700, 0, 100), 0, 100);

  // Send via UDP
  Udp.beginPacket(receiverIP, localPort);
  Udp.write((uint8_t *)&myData, sizeof(myData));
  Udp.endPacket();

  Serial.println("[Sender] UDP Packet Sent");
    // --- Принтиране в Serial Monitor ---
  Serial.println("┌──────────────────────────────────┐");
  Serial.printf("│ Температура: %.2f °C            │\n", myData.dhtTemp);
  Serial.printf("│ Влажност:    %.2f %%            │\n", myData.dhtHum);
  Serial.printf("│ Влажност почва: %d %%           │\n", myData.soilMoisture);
  Serial.println("├──────────────────────────────────┤");
  Serial.println("└──────────────────────────────────┘");

  // --- Създаване на JSON ---
  String jsonPayload = "{";
  jsonPayload += "\"mac_address\":\"" + WiFi.macAddress() + "\",";
  jsonPayload += "\"dht_temp\":" + String(myData.dhtTemp) + ",";
  jsonPayload += "\"dht_hum\":" + String(myData.dhtHum) + ",";
  jsonPayload += "\"soil_moisture\":" + String(myData.soilMoisture) + ","; 
  jsonPayload += "\"water_detected\":" + String("false");
  jsonPayload += "}";
  
  if(sendDataToServer(jsonPayload)){
    ESP.deepSleep(30000000);
  }
  delay(10000);
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