#include <DHT.h>

#define DHTPIN 2
#define DHTTYPE DHT11
#define WATER_PIN  D5


DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(9600);
  dht.begin();
  pinMode(WATER_PIN, INPUT);
  Serial.println("[Water Sensor] Ready.");
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
  
  delay(2000);
}


void printWater(bool detected) {
  Serial.println("┌──────────────────────────┐");
  Serial.printf( "│ Water: %-18s│\n", detected ? "DETECTED ⚠" : "DRY");
  Serial.println("└──────────────────────────┘");
}
