#ifndef ULTRASONIC_H
#define ULTRASONIC_H

#include <Arduino.h>

// Ultrasonic sensor definitions
#define FRONT_ECHO_PIN 35
#define FRONT_TRIG_PIN 17
#define BACK_ECHO_PIN 21
#define BACK_TRIG_PIN 14

// Sensor identifiers
#define SENSOR_FRONT 0
#define SENSOR_BACK 1

// Function to measure distance for a specific sensor
float measureDistance(int sensor);

// Test function for ultrasonic sensors
void testUltrasonic();

#endif // ULTRASONIC_H