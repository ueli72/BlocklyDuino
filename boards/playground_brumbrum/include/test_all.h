// Made for playground_brumbrum
#ifndef TEST_ALL_H
#define TEST_ALL_H

#include <Arduino.h>

#define TEST_DC_MOTOR      (1 << 0)
#define TEST_ULTRASONIC    (1 << 1)
#define TEST_SD_CARD       (1 << 2)
#define TEST_MAX98357A     (1 << 3)
#define TEST_INTERNAL_LED  (1 << 4)
#define TEST_SG90_SERVO    (1 << 5)

void runTestMenu(uint16_t testMask);

#endif
