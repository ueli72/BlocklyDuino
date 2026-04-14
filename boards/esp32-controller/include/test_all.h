// Made for esp32-controller
#ifndef TEST_ALL_H
#define TEST_ALL_H

#include <Arduino.h>

#define TEST_OLED          (1 << 0)
#define TEST_INTERNAL_LED  (1 << 1)
#define TEST_BUTTONS       (1 << 2)
#define TEST_HAPTIC        (1 << 3)
#define TEST_KY023         (1 << 4)

void runTestMenu(uint16_t testMask);

#endif
