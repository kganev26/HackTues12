#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <ESP8266HTTPClient.h>

const char* ssid = "S24";
const char* password = "BatManSavage1976";
//const char* serverURL = "http://192.168.0.127:5500/receive";
const unsigned int localPort = 4210; 

typedef struct struct_message {
    float dhtTemp;
    float dhtHum;
    int soilMoisture;
} struct_message;

struct_message incomingData;
WiFiUDP Udp;
/*void sendDataToBackend(float t, float h, int s) {
  if (WiFi.status() == WL_CONNECTED) {
    WiFiClient client;
    HTTPClient http;
    http.begin(client, serverURL);
    http.addHeader("Content-Type", "application/json");
    String json = "{\"mac_address\":\"" + WiFi.macAddress() + "\",\"dht_temp\":" + String(t) + ",\"dht_hum\":" + String(h) + ",\"soil_moisture\":" + String(s) + ",\"water_detected\":false}";
    int httpCode = http.POST(json);
    Serial.printf("[HTTP] Code: %d\n", httpCode);
    http.end();
  }
}
*/

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500); Serial.print(".");
  }
  Serial.println("\n[Gateway] Connected!");
  Serial.print("IP Address: "); Serial.println(WiFi.localIP()); // COPY THIS TO SENDER
  
  Udp.begin(localPort);
}

void loop() {
  int packetSize = Udp.parsePacket();
  if (packetSize) {
    Udp.read((char *)&incomingData, sizeof(incomingData));
    Serial.printf("\nUDP Received: Temp %.2f, Hum %.2f, Soil %d\n", 
    incomingData.dhtTemp, incomingData.dhtHum, incomingData.soilMoisture);
    
   // sendDataToBackend(incomingData.dhtTemp, incomingData.dhtHum, incomingData.soilMoisture);
  }
}