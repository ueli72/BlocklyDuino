#ifndef OLED_H
#define OLED_H

#include <Arduino.h>
#include <U8g2lib.h>
#include <stdarg.h>

// OLED Display parameters
#define OLED_SDA_PIN 8
#define OLED_SCL_PIN 9
#define OLED_ADDRESS 0x78

// Initialize OLED display
void initOLED();

// Write text to OLED display (supports printf-style formatting)
void writeToOled(const char* format, ...);

// Write integer to OLED display
void writeToOled(int value);

// Clear the OLED display
void clearOled();

// Test function for OLED
void testOLED();

#endif // OLED_H
