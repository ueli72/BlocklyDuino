// Made for esp32-controller
#ifndef BUTTONS_H
#define BUTTONS_H

#include <Arduino.h>

// Button pin definitions
// Extra Button 1 (GPIO21) - WARNING: Disables Serial TX
#define SW1_PIN 21
// Extra Button 2 (GPIO7)
#define SW2_PIN 7
// Extra Button 3 (GPIO8) - Shared with Built-in LED
#define SW3_PIN 8
// Extra Button 4 (GPIO9) - BOOT Button
#define SW4_PIN 9

void initializeButtons(bool sw1, bool sw2, bool sw3, bool sw4);

void testButtons();

#endif // BUTTONS_H
