#include "i2c_scanner.h"

void scanI2CBus(uint8_t sda_pin, uint8_t scl_pin) {
  Serial.println("\n\n=== I2C BUS SCANNER ===\n");
  Serial.printf("Scanning I2C bus on SDA=%d, SCL=%d\n\n", sda_pin, scl_pin);

  // Initialize I2C
  Wire.begin(sda_pin, scl_pin);
  Wire.setClock(400000);

  int nDevices = 0;

  for (uint8_t address = 0x01; address < 0x7F; address++) {
    Wire.beginTransmission(address);
    uint8_t error = Wire.endTransmission();

    if (error == 0) {
      Serial.printf("I2C device found at address 0x%02X\n", address);
      nDevices++;
    }
  }

  if (nDevices == 0) {
    Serial.println("No I2C devices found!");
  } else {
    Serial.printf("\nFound %d device(s) on the I2C bus.\n", nDevices);
  }
  Serial.println("\n=======================\n");
}
