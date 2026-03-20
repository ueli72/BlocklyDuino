#ifndef ULTRASONIC_H
#define ULTRASONIC_H

#include <Arduino.h>

#define FRONT_ECHO_PIN 35
#define FRONT_TRIG_PIN 17
#define BACK_ECHO_PIN 21
#define BACK_TRIG_PIN 14

#define SENSOR_FRONT 0
#define SENSOR_BACK 1

float measureDistance(int sensor);

void testUltrasonicOLED();

#endif