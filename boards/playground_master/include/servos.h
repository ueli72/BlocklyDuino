// Made for playground_master
#ifndef SERVOS_H
#define SERVOS_H

#include <Arduino.h>
#include <ESP32Servo.h>

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

// Servo objects (extern for use in generated code)
extern Servo servo1;
extern Servo servo2;
extern Servo servo3;

// Function to initialize a specific servo
void initializeServo(int servoNum, int pin);

// Function to initialize all servos (backward compatibility)
void initializeServos();

// Function to set servo angle
void setServoAngle(int servoNum, int angle);

// Function to test servos
void testServos();

// Function to test single servo sweep
void testServoSweep(int servoNum);

#endif // SERVOS_H