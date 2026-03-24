#ifndef TEST_ALL_H
#define TEST_ALL_H

#include <Arduino.h>

#define TEST_LED_MATRIX    (1 << 0)
#define TEST_RELAIS        (1 << 1)
#define TEST_DC_MOTOR      (1 << 2)
#define TEST_DHT11         (1 << 3)
#define TEST_ULTRASONIC    (1 << 4)
#define TEST_SD_CARD       (1 << 5)
#define TEST_MAX98357A     (1 << 6)
#define TEST_INTERNAL_LED  (1 << 7)
#define TEST_SG90_SERVO    (1 << 8)

void runTestMenu(uint16_t testMask);

#endif
