#include "i2c_scanner.h"

void scanI2CBus(uint8_t sda_pin, uint8_t scl_pin) {
  Wire.begin(sda_pin, scl_pin);
  Wire.setClock(400000);

  int nDevices = 0;

  for (uint8_t address = 0x01; address < 0x7F; address++) {
    Wire.beginTransmission(address);
    uint8_t error = Wire.endTransmission();

    if (error == 0) {
      nDevices++;
    }
  }
}
