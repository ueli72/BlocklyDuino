#ifndef GYRO_H
#define GYRO_H

#include <Arduino.h>
#include <Wire.h>
#include <Adafruit_MPU6050.h>  // Adafruit MPU6050 (also works with MPU6500)
#include <Adafruit_BMP280.h>

// I2C Pin definitions for GY-91 module
#define GYRO_SCL_PIN 9
#define GYRO_SDA_PIN 8

// I2C Addresses
#define MPU9250_ADDRESS 0x68    // MPU9250 default I2C address (same as MPU6050)
#define BMP280_ADDR 0x76     // BMP280 default address (avoid conflict with library)

// Button pin for test
#define TEST_BUTTON_PIN 1       // SW1 button

// Structure to hold all sensor data
typedef struct {
  // MPU9250 data (9-DOF: Acc + Gyro + Mag)
  float accelX, accelY, accelZ;       // Accelerometer (m/s^2)
  float gyroX, gyroY, gyroZ;          // Gyroscope (rad/s)
  float magX, magY, magZ;             // Magnetometer (µT)
  float temperature;                  // On‑chip temperature (°C)
  float heading;                      // Calculated magnetic heading (°)
  
  // BMP280 data (Environmental)
  float bmp_temperature;              // BMP280 Temperature (°C)
  float pressure;                     // Pressure (Pa)
  float altitude;                     // Altitude (m)
  
} SensorData_t;

// Function prototypes
void initializeGyro();
void readGyroData(SensorData_t* data);
void printSensorData(const SensorData_t* data);
void runGyroTest();

// Helper functions
float calculateHeading(float magX, float magY);
float calculateAltitude(float pressure, float seaLevelPressure = 101325.0);

#endif // GYRO_H
