// Made for playground_master
#ifndef LED_MATRIX_H
#define LED_MATRIX_H

#include <Arduino.h>
#include <Adafruit_NeoPixel.h>

// Pin definition for WS2812B RGB LED Matrix on ESP32-S3
#define LED_MATRIX_PIN 10
#define NUM_LEDS 16

// LED Matrix functions
void initializeLEDMatrix();
void setLEDMatrixPixel(uint8_t index, uint8_t red, uint8_t green, uint8_t blue);
void turnOffLEDMatrix();
void showLEDMatrix();
void runLEDMatrixTest();

// Get pixel object for advanced usage
Adafruit_NeoPixel* getLEDMatrix();

#endif // LED_MATRIX_H
