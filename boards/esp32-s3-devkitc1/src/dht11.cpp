#include "dht11.h"
#include "oled.h"
#include <DHT.h>

// Create DHT sensor object
DHT dht(DHT11_PIN, DHT11);

// Initialize DHT11 sensor
void initDHT11() {
  dht.begin();
  Serial.println("DHT11 sensor initialized");
}

// Read temperature from DHT11
float readTemp() {
  float temperature = dht.readTemperature();
  if (isnan(temperature)) {
    Serial.println("Failed to read temperature from DHT11!");
    return -1.0;
  }
  Serial.print("Temperature: ");
  Serial.print(temperature);
  Serial.println(" °C");
  return temperature;
}

// Read humidity from DHT11
float readHum() {
  float humidity = dht.readHumidity();
  if (isnan(humidity)) {
    Serial.println("Failed to read humidity from DHT11!");
    return -1.0;
  }
  Serial.print("Humidity: ");
  Serial.print(humidity);
  Serial.println(" %");
  return humidity;
}

// Test function for DHT11 sensor
void testDHT11() {
  Serial.println("Starting DHT11 test...");
  
  initDHT11();
  delay(2000);  // Wait for sensor to stabilize
  
  // Read temperature and humidity
  float temperature = readTemp();
  float humidity = readHum();
  
  // Display values on OLED
  if (temperature >= 0 && humidity >= 0) {
    String displayText = "T:" + String(temperature, 1) + "C H:" + String(humidity, 0) + "%";
    writeToOled(displayText.c_str());
  } else {
    writeToOled("DHT11 Error");
  }
  
  Serial.println("DHT11 test completed");
}
