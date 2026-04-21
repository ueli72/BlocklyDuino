// Made for playground_master
#ifndef INTERNAL_LED_H
#define INTERNAL_LED_H

#include <Arduino.h>
#include <Adafruit_NeoPixel.h>

// Pin definition for WS2812B RGB LED on ESP32-S3 DevKit
#define RGB_LED_PIN 48
#define NUM_PIXELS 1

// LED functions
void initializeLED();
void setLED(uint8_t red, uint8_t green, uint8_t blue);

void turnOffLED();
void runLEDInitTest();
void showLED();

// Get pixel object for advanced usage
Adafruit_NeoPixel* getPixel();

#endif // INTERNAL_LED_H