#include "mpu6500_raw.h"
#include "i2c_raw_reader.h"

// Helper function to read multiple bytes from I2C with retry logic
void i2c_read_bytes(uint8_t addr, uint8_t reg, uint8_t* buf, uint8_t len) {
  // Ensure buffer is cleared
  memset(buf, 0, len);
  
  // Retry up to 3 times on I2C error
  for (int attempt = 0; attempt < 3; attempt++) {
    // Add delay before each attempt (exponential backoff)
    if (attempt > 0) {
      delay(10 * (attempt + 1));
    }
    
    // Step 1: Send register address
    Wire.beginTransmission(addr);
    Wire.write(reg);
    int writeErr = Wire.endTransmission(false);  // false = repeated START (don't release bus)
    
    if (writeErr != 0) {
      if (attempt < 2) {  // Not the last attempt
        Serial.printf("  I2C write attempt %d failed (err %d), retrying...\n", attempt + 1, writeErr);
        continue;  // Try again
      }
      // On final failure, just report and return zeros
      Serial.printf("I2C write addr error: %d (failed after 3 attempts)\n", writeErr);
      return;
    }
    
    // Small delay to ensure device is ready
    delay(2);  // Increased delay
    
    // Step 2: Request and read bytes (using repeated START from above)
    int bytesRequested = Wire.requestFrom((int)addr, (int)len, (uint8_t)1);  // 1 = send STOP when done
    
    if (bytesRequested == 0) {
      if (attempt < 2) {
        Serial.printf("  I2C read attempt %d got 0 bytes, retrying...\n", attempt + 1);
        delay(10 * (attempt + 1));
        Wire.endTransmission();  // Clean up from failed read
        continue;
      }
      Serial.printf("I2C requestFrom failed: requested %d, got 0 bytes\n", len);
      return;
    }
    
    if (bytesRequested != len) {
      Serial.printf("I2C mismatch: requested %d, got %d\n", len, bytesRequested);
    }
    
    // Step 3: Read available bytes
    int bytesRead = 0;
    uint32_t timeout = millis() + 50;
    
    while (bytesRead < bytesRequested && millis() < timeout) {
      if (Wire.available()) {
        buf[bytesRead] = Wire.read();
        bytesRead++;
      }
    }
    
    if (bytesRead == bytesRequested) {
      // Success! Return early
      return;
    }
    
    if (attempt < 2) {
      Serial.printf("  I2C incomplete read attempt %d: got %d/%d bytes, retrying...\n", 
                    attempt + 1, bytesRead, bytesRequested);
    } else {
      Serial.printf("I2C read incomplete: got %d/%d bytes (failed after 3 attempts)\n", bytesRead, bytesRequested);
    }
  }
}

// Helper function to write a byte to I2C with retry logic
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
      return;  // Success
    }
    
    if (attempt < 2) {
      Serial.printf("  I2C write to reg 0x%02X attempt %d failed (err %d), retrying...\n", 
                    reg, attempt + 1, err);
    } else {
      Serial.printf("I2C write error to reg 0x%02X: %d (failed after 3 attempts)\n", reg, err);
    }
  }
  delay(10);  // Extra delay after failed writes
}

// Initialize MPU6500
bool mpu6500_init() {
  Serial.println("Initializing MPU6500 (raw I2C)...");
  delay(100);  // Initial power-up delay
  
  // First, verify WHO_AM_I register
  uint8_t whoami_buf[1];
  i2c_read_bytes(MPU6500_ADDR, 0x75, whoami_buf, 1);  // WHO_AM_I register
  Serial.printf("  WHO_AM_I = 0x%02X (expected 0x70)\n", whoami_buf[0]);
  delay(50);
  
  if (whoami_buf[0] != 0x70) {
    Serial.printf("  ERROR: WHO_AM_I mismatch! Device might be wrong type.\n");
  }
  
  // Wake up MPU6500 (clear sleep bit)
  i2c_write_byte(MPU6500_ADDR, MPU6500_PWR_MGMT_1, 0x00);
  delay(200);  // CRITICAL: Give sensor time to wake from sleep
  
  // Set accelerometer range to ±16g (0x18 = 2 << 3)
  i2c_write_byte(MPU6500_ADDR, MPU6500_ACCEL_CONFIG, 0x18);
  delay(100);
  
  // Set gyroscope range to ±2000°/s (0x18 = 3 << 3)
  i2c_write_byte(MPU6500_ADDR, MPU6500_GYRO_CONFIG, 0x18);
  delay(100);
  
  // Enable sensor by setting CLK_SEL to X-axis gyro for stable clock
  i2c_write_byte(MPU6500_ADDR, MPU6500_PWR_MGMT_1, 0x01);  // CLK_SEL = 1 (X-axis gyro clock)
  delay(200);
  
  // Verify initialization by reading a register
  uint8_t verify_buf[1];
  i2c_read_bytes(MPU6500_ADDR, MPU6500_PWR_MGMT_1, verify_buf, 1);
  Serial.printf("  Verification: PWR_MGMT_1 = 0x%02X\n", verify_buf[0]);
  delay(100);
  
  Serial.println("  ✓ MPU6500 initialized");
  return true;
}

// Read sensor data from MPU6500
bool mpu6500_read(MPU6500Data* data) {
  if (data == NULL) return false;
  
  uint8_t buffer[14];
  
  // Read all 14 bytes from accelerometer, temperature, and gyroscope
  i2c_read_bytes(MPU6500_ADDR, MPU6500_ACCEL_XOUT_H, buffer, 14);
  
  // DEBUG: Print raw bytes - every cycle to diagnose issue
  Serial.print("RAW HEX: ");
  for (int i = 0; i < 14; i++) {
    Serial.printf("%02X ", buffer[i]);
  }
  
  // Also print as int16 pairs
  Serial.print(" | INT16: ");
  for (int i = 0; i < 7; i++) {
    int16_t val = (buffer[i*2] << 8) | buffer[i*2 + 1];
    Serial.printf("%6d ", val);
  }
  Serial.println();
  
  // Convert raw accelerometer data to m/s^2
  // ±16g range: 32768 LSB per 1g, 1g = 9.81 m/s^2
  int16_t acel_x = (buffer[0] << 8) | buffer[1];
  int16_t acel_y = (buffer[2] << 8) | buffer[3];
  int16_t accel_z = (buffer[4] << 8) | buffer[5];
  
  const float accel_scale = 9.81 / 2048.0;  // ±16g range
  data->accelX = acel_x * accel_scale;
  data->accelY = acel_y * accel_scale;
  data->accelZ = accel_z * accel_scale;
  
  // Read temperature
  // Temperature in °C = (TEMP_OUT / 340) + 36.53
  int16_t temp_raw = (buffer[6] << 8) | buffer[7];
  data->temperature = (temp_raw / 340.0) + 36.53;
  
  // Convert raw gyroscope data to °/s
  // ±2000°/s range: 16.4 LSB per 1°/s
  int16_t gyro_x = (buffer[8] << 8) | buffer[9];
  int16_t gyro_y = (buffer[10] << 8) | buffer[11];
  int16_t gyro_z = (buffer[12] << 8) | buffer[13];
  
  const float gyro_scale = 1.0 / 16.4;  // ±2000°/s range
  data->gyroX = gyro_x * gyro_scale;
  data->gyroY = gyro_y * gyro_scale;
  data->gyroZ = gyro_z * gyro_scale;
  
  return true;
}
