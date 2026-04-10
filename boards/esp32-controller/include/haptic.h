// Haptic Actuator (Haptikmotor) for ESP32-Controller
// GPIO 10 - Vibration motor control

#ifndef HAPTIC_H
#define HAPTIC_H

#include <Arduino.h>
#include <Ticker.h>

// Haptic motor pin definition
#define HAPTIC_PIN 10

// Function to initialize haptic actuator
void initHaptic();

// Function to turn haptic actuator ON
void hapticOn();

// Function to turn haptic actuator OFF
void hapticOff();

// Function to vibrate for specified milliseconds (non-blocking)
void hapticVibrate(int milliseconds);

#endif // HAPTIC_H
