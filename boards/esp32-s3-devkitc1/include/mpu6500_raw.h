#ifndef MPU6500_RAW_H
#define MPU6500_RAW_H

#include <Arduino.h>
#include <Wire.h>

// MPU6500 Register definitions
#define MPU6500_ADDR 0x68
#define MPU6500_ACCEL_XOUT_H 0x3B
#define MPU6500_GYRO_XOUT_H 0x43
#define MPU6500_TEMP_OUT_H 0x41
#define MPU6500_PWR_MGMT_1 0x6B
#define MPU6500_ACCEL_CONFIG 0x1C
#define MPU6500_GYRO_CONFIG 0x1B

struct MPU6500Data {
  float accelX, accelY, accelZ;  // in m/s^2
  float gyroX, gyroY, gyroZ;     // in °/s
  float temperature;              // in °C
};

// Initialize MPU6500
bool mpu6500_init();

// Read sensor data from MPU6500
bool mpu6500_read(MPU6500Data* data);

#endif // MPU6500_RAW_H
