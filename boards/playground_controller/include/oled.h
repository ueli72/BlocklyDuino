// Made for playground_controller
#ifndef OLED_H
#define OLED_H

#include <Arduino.h>
#include <U8g2lib.h>
#include <Wire.h>
#include <stdarg.h>

// OLED Display parameters for 0.42" 72x40 SSD1306
#define OLED_SDA_PIN 5
#define OLED_SCL_PIN 6
#define OLED_WIDTH 72
#define OLED_HEIGHT 40

// OLED object (extern for use in generated code)
extern U8G2_SSD1306_72X40_ER_F_HW_I2C u8g2;

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
