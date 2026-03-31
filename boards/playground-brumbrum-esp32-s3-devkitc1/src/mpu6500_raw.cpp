#include "mpu6500_raw.h"
#include "i2c_raw_reader.h"

void i2c_read_bytes(uint8_t addr, uint8_t reg, uint8_t* buf, uint8_t len) {
  memset(buf, 0, len);
  
  for (int attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) {
      delay(10 * (attempt + 1));
    }
    
    Wire.beginTransmission(addr);
    Wire.write(reg);
    int writeErr = Wire.endTransmission(false);
    
    if (writeErr != 0) {
      if (attempt < 2) {
        continue;
      }
      return;
    }
    
    delay(2);
    
    size_t bytesRequested = Wire.requestFrom((uint8_t)addr, (size_t)len, true);
    
    if (bytesRequested == 0) {
      if (attempt < 2) {
        delay(10 * (attempt + 1));
        Wire.endTransmission();
        continue;
      }
      return;
    }
    
    if (bytesRequested != len) {
    }
    
    int bytesRead = 0;
    uint32_t timeout = millis() + 50;
    
    while (bytesRead < bytesRequested && millis() < timeout) {
      if (Wire.available()) {
        buf[bytesRead] = Wire.read();
        bytesRead++;
      }
    }
    
    if (bytesRead == bytesRequested) {
      return;
    }
  }
}

void i2c_write_byte(uint8_t addr, uint8_t reg, uint8_t data) {
  for (int attempt = 0; attempt < 3; attempt++) {
    if (attempt > 0) {
      delay(5 * (attempt + 1));
    }
    
    Wire.beginTransmission(addr);
    Wire.write(reg);
    Wire.write(data);
    int err = Wire.endTransmission();
    
    if (err == 0) {
      return;
    }
  }
  delay(10);
}

bool mpu6500_init() {
  delay(100);
  
  uint8_t whoami_buf[1];
  i2c_read_bytes(MPU6500_ADDR, 0x75, whoami_buf, 1);
  delay(50);
  
  i2c_write_byte(MPU6500_ADDR, MPU6500_PWR_MGMT_1, 0x00);
  delay(200);
  
  i2c_write_byte(MPU6500_ADDR, MPU6500_ACCEL_CONFIG, 0x18);
  delay(100);
  
  i2c_write_byte(MPU6500_ADDR, MPU6500_GYRO_CONFIG, 0x18);
  delay(100);
  
  i2c_write_byte(MPU6500_ADDR, MPU6500_PWR_MGMT_1, 0x01);
  delay(200);
  
  uint8_t verify_buf[1];
  i2c_read_bytes(MPU6500_ADDR, MPU6500_PWR_MGMT_1, verify_buf, 1);
  delay(100);
  
  return true;
}

bool mpu6500_read(MPU6500Data* data) {
  if (data == NULL) return false;
  
  uint8_t buffer[14];
  
  i2c_read_bytes(MPU6500_ADDR, MPU6500_ACCEL_XOUT_H, buffer, 14);
  
  int16_t acel_x = (buffer[0] << 8) | buffer[1];
  int16_t acel_y = (buffer[2] << 8) | buffer[3];
  int16_t accel_z = (buffer[4] << 8) | buffer[5];
  
  const float accel_scale = 9.81 / 2048.0;
  data->accelX = acel_x * accel_scale;
  data->accelY = acel_y * accel_scale;
  data->accelZ = accel_z * accel_scale;
  
  int16_t temp_raw = (buffer[6] << 8) | buffer[7];
  data->temperature = (temp_raw / 340.0) + 36.53;
  
  int16_t gyro_x = (buffer[8] << 8) | buffer[9];
  int16_t gyro_y = (buffer[10] << 8) | buffer[11];
  int16_t gyro_z = (buffer[12] << 8) | buffer[13];
  
  const float gyro_scale = 1.0 / 16.4;
  data->gyroX = gyro_x * gyro_scale;
  data->gyroY = gyro_y * gyro_scale;
  data->gyroZ = gyro_z * gyro_scale;
  
  return true;
}
