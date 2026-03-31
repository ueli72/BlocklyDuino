#include "i2c_raw_reader.h"

void resetI2CBus(uint8_t sda_pin, uint8_t scl_pin) {
  pinMode(sda_pin, OUTPUT);
  pinMode(scl_pin, OUTPUT);
  
  digitalWrite(sda_pin, LOW);
  digitalWrite(scl_pin, LOW);
  delayMicroseconds(100);
  
  digitalWrite(scl_pin, HIGH);
  delayMicroseconds(100);
  
  digitalWrite(sda_pin, HIGH);
  delayMicroseconds(100);
}

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
  uint8_t whoami = readWhoAmI(0x68, 0x75);
}

void diagnoseBMP280() {
  uint8_t whoami_76 = readWhoAmI(0x76, 0xD0);
  uint8_t whoami_77 = readWhoAmI(0x77, 0xD0);
}
