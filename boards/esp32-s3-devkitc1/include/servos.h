#ifndef SERVOS_H
#define SERVOS_H

#include <Arduino.h>

// Servo pin definitions
#define SERVO1_PIN 37
#define SERVO2_PIN 38
#define SERVO3_PIN 45

// Servo number constants
#define SERVO1 1
#define SERVO2 2
#define SERVO3 3

// Number of servos
#define NUM_SERVOS 3

// Function to initialize servos
void initializeServos();

// Function to set servo angle
void setServoAngle(int servoNum, int angle);

// Function to test servos
void testServos();

// Function to test single servo sweep
void testServoSweep(int servoNum);

#endif // SERVOS_H