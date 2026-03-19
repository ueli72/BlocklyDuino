 #ifndef DHT11_H
#define DHT11_H

#include <Arduino.h>

// DHT11 sensor pin
#define DHT11_PIN 6

// Initialize DHT11 sensor
void initDHT11();

// Read temperature from DHT11 (returns value in Celsius)
float readTemp();

// Read humidity from DHT11 (returns value in %)
float readHum();

// Test function for DHT11 sensor
void testDHT11();

#endif // DHT11_H
