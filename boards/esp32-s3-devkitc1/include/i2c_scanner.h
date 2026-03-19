#ifndef I2C_SCANNER_H
#define I2C_SCANNER_H

#include <Arduino.h>
#include <Wire.h>

// Scan I2C bus and print all found devices
void scanI2CBus(uint8_t sda_pin, uint8_t scl_pin);

#endif // I2C_SCANNER_H
