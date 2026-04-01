// Made for esp32-s3-devkitc1
#include "brightness.h"

int readBrightness(int pin) {
  pinMode(pin, INPUT);
  return analogRead(pin);
}
