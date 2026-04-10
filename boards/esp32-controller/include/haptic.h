// Haptic Actuator (Haptikmotor) for ESP32-Controller
// GPIO 20 (UART RX) - Vibration motor control
// WARNING: Using GPIO20 disables UART RX (Serial input)

#ifndef HAPTIC_H
#define HAPTIC_H

#include <Arduino.h>
#include <Ticker.h>

// Haptic motor pin definition (uses UART RX pin)
#define HAPTIC_PIN 20

// Function to initialize haptic actuator
void initHaptic();

// Function to turn haptic actuator ON
void hapticOn();

// Function to turn haptic actuator OFF
void hapticOff();

// Function to vibrate for specified milliseconds (non-blocking)
void hapticVibrate(int milliseconds);

#endif // HAPTIC_H
