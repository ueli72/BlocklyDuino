#ifndef OLED_H
#define OLED_H

#include <Arduino.h>
#include <U8g2lib.h>

// OLED Display parameters
#define OLED_SDA_PIN 8
#define OLED_SCL_PIN 9
#define OLED_ADDRESS 0x78  // 0x78 or 0x3C depending on configuration

// Initialize OLED display
void initOLED();

// Write text to OLED display
void writeToOled(const char* text);

// Clear the OLED display
void clearOled();

// Test function for OLED
void testOLED();

#endif // OLED_H
