#ifndef RELAIS_H
#define RELAIS_H

#include <Arduino.h>

// Relay pin definitions
#define RELAY1_PIN 48
#define RELAY2_PIN 47

// Function to set relay state
void setRelay(int relayNum, bool state);

// Test function for relays
void testRelays();

// Test sequence for relays
void testRelaisSequence();

#endif // RELAIS_H