#include "dht11.h"
#include "oled.h"
#include <DHT.h>

DHT dht(DHT11_PIN, DHT11);

void initDHT11() {
  dht.begin();
}

float readTemp() {
  float temperature = dht.readTemperature();
  if (isnan(temperature)) {
    return -1.0;
  }
  return temperature;
}

float readHum() {
  float humidity = dht.readHumidity();
  if (isnan(humidity)) {
    return -1.0;
  }
  return humidity;
}

void testDHT11() {
  initDHT11();
  delay(2000);
  
  float temperature = readTemp();
  float humidity = readHum();
  
  if (temperature >= 0 && humidity >= 0) {
    String displayText = "T:" + String(temperature, 1) + "C H:" + String(humidity, 0) + "%";
    writeToOled(displayText.c_str());
  } else {
    writeToOled("DHT11 Error");
  }
}
