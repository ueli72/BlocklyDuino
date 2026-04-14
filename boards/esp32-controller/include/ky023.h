// Made for esp32-controller
#ifndef KY023_H
#define KY023_H

#include <Arduino.h>

// JoyLeft pin definitions
#define JOY_LEFT_X_PIN    1
#define JOY_LEFT_Y_PIN    2
#define JOY_LEFT_SW_PIN   0

// JoyRight pin definitions
#define JOY_RIGHT_X_PIN   4
#define JOY_RIGHT_Y_PIN   3
#define JOY_RIGHT_SW_PIN  10

// Initialization functions
void initJoyLeft();
void initJoyRight();

// JoyLeft read functions
int readJoyLeftX();
int readJoyLeftY();
bool isJoyLeftPressed();

// JoyRight read functions
int readJoyRightX();
int readJoyRightY();
bool isJoyRightPressed();

// Test functions
void testJoyLeft();
void testJoyRight();
void testKY023();

#endif
