#ifndef DCMOTOR_H
#define DCMOTOR_H

#include <Arduino.h>

// DC Motor pin definitions (each motor has two control pins)
// Module 1
#define MOTOR1_IN1_PIN 15   // Changed from 0 to 5 (GPIO0 is boot pin, can cause issues)
#define MOTOR1_IN2_PIN 16   // IN2: PWM or high/low
#define MOTOR2_IN1_PIN 43  // IN3
#define MOTOR2_IN2_PIN 44  // IN4

// Module 2
#define MOTOR3_IN1_PIN 0  // IN1
#define MOTOR3_IN2_PIN 7  // IN2
#define MOTOR4_IN1_PIN 12  // IN3
#define MOTOR4_IN2_PIN 13  // IN4

// Directions
#define FORWARD 1
#define BACKWARD 0

// Function to initialize DC motor pins
void initDCMotors();

// Function to set DC motor speed and direction
void setDCSpeed(int motorNum, int direction, int speedPercent);

// Test function for DC motors
void testDCMotors();

#endif // DCMOTOR_H