#ifndef DHT11_H
#define DHT11_H

#include <Arduino.h>

#define DHT11_PIN 6

void initDHT11();

float readDHT11Temperature();

float readDHT11Humidity();

void testDHT11();

#endif
