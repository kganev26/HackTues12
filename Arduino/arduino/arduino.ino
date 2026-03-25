#include <DHT.h>
#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <SPI.h>

#define DHTPIN 2
#define DHTTYPE DHT11
#define WATER_PIN  D5

const char* ssid = "Daniel's S24";
const char* password = "BatManSavage1976";
const char* serverURL = "http://192.168.248.104:5500/cardnum";  

DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
  pinMode(WATER_PIN, INPUT);
  Serial.println("[Water Sensor] Ready.");
  WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
    }

}

void loop() {
  float temp = dht.readTemperature();
  float hum = dht.readHumidity();

  if (isnan(temp) || isnan(hum)) {
    Serial.println("Failed to read from DHT!");
    return;
  }
  Serial.print("Temp: ");
  Serial.print(temp);
  Serial.print(" °C  |  Humidity: ");
  Serial.print(hum);
  Serial.println(" %");
  
  bool waterDetected = (digitalRead(WATER_PIN) == HIGH);
  printWater(waterDetected);
  String uidString = "";
  byte i = 1
  uid
  sendUIDToServer(uidString);
  delay(2000);
}


void printWater(bool detected) {
  Serial.println("┌──────────────────────────┐");
  Serial.printf( "│ Water: %-18s│\n", detected ? "DETECTED ⚠" : "DRY");
  Serial.println("└──────────────────────────┘");
}
void sendUIDToServer(String uid) {
    if (WiFi.status() == WL_CONNECTED) {
        WiFiClient client;
        HTTPClient http;
        http.begin(client, serverURL);
        http.addHeader("Content-Type", "application/json");
        String jsonPayload = "{\"uid\":\"" + uid + "\"}";
        int httpResponseCode = http.POST(jsonPayload);
        Serial.print(jsonPayload);
        if (httpResponseCode > 0) {
            String response = http.getString();
            Serial.println(response);
        } else {
            Serial.print("Error");
        }
        http.end();
    } else {
        WiFi.begin(ssid, password);
    }
}
