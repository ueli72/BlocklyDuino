// Made for esp32-s3-devkitc1
#ifndef BUTTONS_H
#define BUTTONS_H

#include <Arduino.h>

// Button pin definitions
#define SW1_PIN 1
#define SW2_PIN 4
#define SW3_PIN 3
#define SW4_PIN 2

void initializeButtons(bool sw1, bool sw2, bool sw3, bool sw4);

void testButtons();

#endif // BUTTONS_H