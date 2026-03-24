#include "brightness.h"

int readBrightness(int pin) {
  pinMode(pin, INPUT);
  return analogRead(pin);
}
