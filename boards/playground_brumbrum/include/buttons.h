// Made for playground_brumbrum
#ifndef BUTTONS_H
#define BUTTONS_H

#include <Arduino.h>

// Button pin definitions
#define SW1_PIN 1
#define SW2_PIN 2

void initializeButtons(bool sw1, bool sw2);

void testButtons();

#endif // BUTTONS_H
