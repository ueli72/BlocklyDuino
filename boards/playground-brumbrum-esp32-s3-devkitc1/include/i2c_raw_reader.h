#ifndef I2C_RAW_READER_H
#define I2C_RAW_READER_H

#include <Arduino.h>
#include <Wire.h>

// Perform a soft reset of the I2C bus by toggling SDA/SCL lines
void resetI2CBus(uint8_t sda_pin, uint8_t scl_pin);

// Read a single register from I2C device
uint8_t readWhoAmI(uint8_t address, uint8_t reg);

// Detailed diagnostic for MPU9250 at 0x68
void diagnoseMPU9250();

// Detailed diagnostic for BMP280 at 0x76/0x77
void diagnoseBMP280();

#endif // I2C_RAW_READER_H
