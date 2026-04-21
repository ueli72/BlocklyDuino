// Made for playground_master
#ifndef BUTTONS_H
#define BUTTONS_H

#include <Arduino.h>

// Button pin definitions
#define SW1_PIN 21
#define SW2_PIN 7
#define SW3_PIN 8
#define SW4_PIN 9

void initializeButtons(bool sw1, bool sw2, bool sw3, bool sw4);

void testButtons();

#endif // BUTTONS_H