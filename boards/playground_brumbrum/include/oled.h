// Made for playground_brumbrum
#ifndef OLED_H
#define OLED_H

#include <Arduino.h>
#include <U8g2lib.h>
#include <stdarg.h>

// OLED Display parameters
#define OLED_SDA_PIN 8
#define OLED_SCL_PIN 9
#define OLED_ADDRESS 0x78

// Initialize OLED display (optional rotation: U8G2_R0, U8G2_R1, U8G2_R2, U8G2_R3, U8G2_MIRROR)
void initOLED(const u8g2_cb_t* rotation = U8G2_R0);

// Write text to OLED display (supports printf-style formatting)
void writeToOled(const char* format, ...);

// Write String to OLED display
void writeToOled(const String& str);

// Write integer to OLED display
void writeToOled(int value);

// Clear the OLED display
void clearOled();

// Test function for OLED
void testOLED();

#endif // OLED_H
