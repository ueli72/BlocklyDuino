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

void testRelays() {
  setRelay(1, false);
  setRelay(2, false);

  pinMode(SW1_PIN, INPUT_PULLUP);
  pinMode(SW2_PIN, INPUT_PULLUP);
  pinMode(SW3_PIN, INPUT_PULLUP);

  turnOffLEDMatrix();

  bool prevRelay1State = false;
  bool prevRelay2State = false;

  bool running = true;
  while (running) {
    bool sw1Pressed = (digitalRead(SW1_PIN) == LOW);
    bool sw2Pressed = (digitalRead(SW2_PIN) == LOW);

    setRelay(1, sw1Pressed);
    if (sw1Pressed) {
      setLEDMatrixPixel(0, 255, 255, 255);
    } else {
      setLEDMatrixPixel(0, 0, 0, 0);
    }

    setRelay(2, sw2Pressed);
    if (sw2Pressed) {
      setLEDMatrixPixel(1, 255, 255, 255);
    } else {
      setLEDMatrixPixel(1, 0, 0, 0);
    }

    showLEDMatrix();

    prevRelay1State = sw1Pressed;
    prevRelay2State = sw2Pressed;

    if (digitalRead(SW3_PIN) == LOW) {
      running = false;
      delay(200);
    }

    delay(50);
  }

  setLEDMatrixPixel(0, 0, 0, 0);
  setLEDMatrixPixel(1, 0, 0, 0);
  showLEDMatrix();
}
