#include "relais.h"
#include "LEDMatrix.h"
#include "buttons.h"

void setRelay(int relayNum, bool state) {
  int pin;
  if (relayNum == 1) {
    pin = RELAY1_PIN;
  } else if (relayNum == 2) {
    pin = RELAY2_PIN;
  } else {
    return;
  }

  pinMode(pin, OUTPUT);
  digitalWrite(pin, state ? HIGH : LOW);
}


void testRelaisSequence() {
  for (int i = 0; i < 5; i++) {
    setRelay(1, true);
    delay(500);
    setRelay(1, false);
    delay(500);
    setRelay(2, true);
    delay(500);
    setRelay(2, false);
    delay(500);
  }
}
