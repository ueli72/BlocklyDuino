// Made for playground_master
#include "dht11.h"
#include "oled.h"
#include <DHT.h>

DHT dht(DHT11_PIN, DHT11);

void initDHT11() {
  dht.begin();
}

float readDHT11Temperature() {
  float temperature = dht.readTemperature();
  if (isnan(temperature)) {
    return -1.0;
  }
  return temperature;
}

float readDHT11Humidity() {
  float humidity = dht.readHumidity();
  if (isnan(humidity)) {
    return -1.0;
  }
  return humidity;
}

void testDHT11() {
  initOLED();
  delay(2000);
  
  for (int i = 0; i < 10; i++) {
    float temperature = readDHT11Temperature();
    float humidity = readDHT11Humidity();
    
    char buffer[64];
    if (temperature >= 0 && humidity >= 0) {
      snprintf(buffer, sizeof(buffer), "Temp: %.1f C\nHumidity: %.0f %%", temperature, humidity);
    } else {
      snprintf(buffer, sizeof(buffer), "DHT11 Error\nCheck connection");
    }
    writeToOled(buffer);
    delay(2000);
  }
  
  clearOled();
}
