#include "buttons.h"
#include "LEDMatrix.h"

bool sw1Pressed = false;
bool sw2Pressed = false;
bool sw3Pressed = false;
bool sw4Pressed = false;

void testButtons() {
  pinMode(SW1_PIN, INPUT_PULLUP);
  pinMode(SW2_PIN, INPUT_PULLUP);
  pinMode(SW3_PIN, INPUT_PULLUP);
  pinMode(SW4_PIN, INPUT_PULLUP);

  turnOffLEDMatrix();

  while (!(sw1Pressed && sw2Pressed && sw3Pressed && sw4Pressed)) {
    if (!sw1Pressed && digitalRead(SW1_PIN) == LOW) {
      sw1Pressed = true;
      setLEDMatrixPixel(0, 255, 255, 255);
      showLEDMatrix();
      delay(200);
    }

    if (!sw2Pressed && digitalRead(SW2_PIN) == LOW) {
      sw2Pressed = true;
      setLEDMatrixPixel(1, 255, 255, 255);
      showLEDMatrix();
      delay(200);
    }

    if (!sw3Pressed && digitalRead(SW3_PIN) == LOW) {
      sw3Pressed = true;
      setLEDMatrixPixel(2, 255, 255, 255);
      showLEDMatrix();
      delay(200);
    }

    if (!sw4Pressed && digitalRead(SW4_PIN) == LOW) {
      sw4Pressed = true;
      setLEDMatrixPixel(3, 255, 255, 255);
      showLEDMatrix();
      delay(200);
    }

    delay(10);
  }

  turnOffLEDMatrix();
}
