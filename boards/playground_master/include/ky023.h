// Made for playground_master
#ifndef KY023_H
#define KY023_H

#include <Arduino.h>

// Default pin assignments (can be overridden via init functions)
#define JOY_LEFT_X_PIN_DEFAULT    1
#define JOY_LEFT_Y_PIN_DEFAULT    2
#define JOY_LEFT_SW_PIN_DEFAULT   0

#define JOY_RIGHT_X_PIN_DEFAULT   4
#define JOY_RIGHT_Y_PIN_DEFAULT   3
#define JOY_RIGHT_SW_PIN_DEFAULT  10

// Initialization functions with selectable pins
void initJoyLeft(int xPin = JOY_LEFT_X_PIN_DEFAULT, 
                 int yPin = JOY_LEFT_Y_PIN_DEFAULT, 
                 int swPin = JOY_LEFT_SW_PIN_DEFAULT);
void initJoyRight(int xPin = JOY_RIGHT_X_PIN_DEFAULT, 
                  int yPin = JOY_RIGHT_Y_PIN_DEFAULT, 
                  int swPin = JOY_RIGHT_SW_PIN_DEFAULT);

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
