#include <DHT.h>
#include <ESP8266WiFi.h>
#include <WiFiUdp.h>
#include <Servo.h>

#define DHTPIN D1 
#define DHTTYPE DHT11
#define SOIL_PIN A0 
#define SERVO_PIN D5 

const char* ssid = "Ap8";
const char* password = "Q1w2e3r4t5";
// REPLACE with the IP Address printed by your Receiver!
const char* receiverIP = "192.168.0.129"; 
const unsigned int localPort = 4210; 

typedef struct struct_message {
    float dhtTemp;
    float dhtHum;
    int soilMoisture;
} struct_message;

struct_message myData;
WiFiUDP Udp;
DHT dht(DHTPIN, DHTTYPE);
Servo myServo;

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n[Sender] Connected to WiFi");
  Udp.begin(localPort);
}

void loop() {
  myData.dhtTemp = dht.readTemperature();
  myData.dhtHum = dht.readHumidity();
  int rawMoisture = analogRead(SOIL_PIN);
  myData.soilMoisture = constrain(map(rawMoisture, 15, 700, 0, 100), 0, 100);

  // Servo Logic
  myServo.attach(SERVO_PIN);
  if (myData.soilMoisture < 20) myServo.write(180);
  else myServo.write(0);
  delay(500);
  myServo.detach();

  // Send via UDP
  Udp.beginPacket(receiverIP, localPort);
  Udp.write((uint8_t *)&myData, sizeof(myData));
  Udp.endPacket();

  Serial.println("[Sender] UDP Packet Sent");
  delay(10000);
}