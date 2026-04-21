// Made for playground_controller
// Haptic Actuator (Haptikmotor)
// GPIO 20 (UART RX) - Vibration motor control
// WARNING: Using GPIO20 disables UART RX (Serial input)

#include "haptic.h"

// Ticker object for non-blocking vibration
static Ticker hapticTicker;
static bool hapticInitialized = false;

// Internal function to ensure initialization
static void ensureHapticInit() {
  if (!hapticInitialized) {
    pinMode(HAPTIC_PIN, OUTPUT);
    digitalWrite(HAPTIC_PIN, LOW);
    hapticInitialized = true;
  }
}

// Callback to turn off haptic motor after vibration duration
static void hapticStopCallback() {
  digitalWrite(HAPTIC_PIN, LOW);
  hapticTicker.detach();  // Stop the ticker
}

void initHaptic() {
  pinMode(HAPTIC_PIN, OUTPUT);
  digitalWrite(HAPTIC_PIN, LOW);
  hapticInitialized = true;
}

void hapticOn() {
  ensureHapticInit();
  digitalWrite(HAPTIC_PIN, HIGH);
}

void hapticOff() {
  ensureHapticInit();
  digitalWrite(HAPTIC_PIN, LOW);
  hapticTicker.detach();  // Cancel any pending vibration
}

void hapticVibrate(int milliseconds) {
  ensureHapticInit();
  
  // Turn on the haptic motor
  digitalWrite(HAPTIC_PIN, HIGH);
  
  // Schedule turn-off after specified milliseconds (non-blocking)
  hapticTicker.once_ms(milliseconds, hapticStopCallback);
}
