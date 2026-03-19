#include "i2c_raw_reader.h"

// Perform a soft reset of the I2C bus by toggling SDA/SCL lines
void resetI2CBus(uint8_t sda_pin, uint8_t scl_pin) {
  Serial.println("\nPerforming I2C bus reset...");
  
  pinMode(sda_pin, OUTPUT);
  pinMode(scl_pin, OUTPUT);
  
  // Pull both lines low
  digitalWrite(sda_pin, LOW);
  digitalWrite(scl_pin, LOW);
  delayMicroseconds(100);
  
  // Release SCL first
  digitalWrite(scl_pin, HIGH);
  delayMicroseconds(100);
  
  // Release SDA
  digitalWrite(sda_pin, HIGH);
  delayMicroseconds(100);
  
  Serial.println("I2C bus reset complete.");
}

// Read a single register from device at address
uint8_t readWhoAmI(uint8_t address, uint8_t reg) {
  Wire.beginTransmission(address);
  Wire.write(reg);
  uint8_t error = Wire.endTransmission();
  
  if (error != 0) {
    return 0xFF;
  }
  
  Wire.requestFrom((int)address, 1);
  if (Wire.available()) {
    return Wire.read();
  }
  return 0xFF;
}

void diagnoseMPU9250() {
  Serial.println("\n=== MPU9250 DIAGNOSIS ===");
  Serial.println("Trying to read WHO_AM_I register from address 0x68...");
  
  uint8_t whoami = readWhoAmI(0x68, 0x75);  // 0x75 = WHO_AM_I register
  
  Serial.printf("WHO_AM_I value: 0x%02X\n", whoami);
  if (whoami == 0x71) {
    Serial.println("✓ SUCCESS: MPU9250 detected (WHO_AM_I = 0x71)");
  } else if (whoami == 0x70) {
    Serial.println("! Found MPU6500 instead (WHO_AM_I = 0x70)");
  } else if (whoami == 0xFF) {
    Serial.println("✗ FAIL: Device not responding at 0x68");
  } else {
    Serial.printf("? UNKNOWN: Device at 0x68 returns 0x%02X (expected 0x71)\n", whoami);
  }
}

void diagnoseBMP280() {
  Serial.println("\n=== BMP280 DIAGNOSIS ===");
  
  // Try 0x76 (gyro.h address)
  Serial.println("Trying to read WHO_AM_I register from address 0x76...");
  uint8_t whoami_76 = readWhoAmI(0x76, 0xD0);  // 0xD0 = WHO_AM_I register
  Serial.printf("WHO_AM_I at 0x76: 0x%02X\n", whoami_76);
  
  if (whoami_76 == 0x58) {
    Serial.println("✓ SUCCESS: BMP280 detected at 0x76");
    return;
  }
  
  // Try 0x77 (library default)
  Serial.println("Also trying address 0x77 (library default)...");
  uint8_t whoami_77 = readWhoAmI(0x77, 0xD0);
  Serial.printf("WHO_AM_I at 0x77: 0x%02X\n", whoami_77);
  
  if (whoami_77 == 0x58) {
    Serial.println("✓ BMP280 found at 0x77 instead!");
    Serial.println("→ You should change BMP280_ADDRESS to 0x77 in gyro.h");
    return;
  }
  
  if (whoami_76 == 0xFF && whoami_77 == 0xFF) {
    Serial.println("✗ FAIL: BMP280 not responding at either 0x76 or 0x77");
  }
}
