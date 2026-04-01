// Made for playground-brumbrum-esp32-s3-devkitc1
#include "buttons.h"
#include "LEDMatrix.h"

bool sw1Pressed = false;
bool sw2Pressed = false;

void initializeButtons(bool sw1, bool sw2) {
  if (sw1) pinMode(SW1_PIN, INPUT_PULLUP);
  if (sw2) pinMode(SW2_PIN, INPUT_PULLUP);
}

void testButtons() {
  sw1Pressed = false;
  sw2Pressed = false;

  pinMode(SW1_PIN, INPUT_PULLUP);
  pinMode(SW2_PIN, INPUT_PULLUP);

  turnOffLEDMatrix();

  while (!(sw1Pressed && sw2Pressed)) {
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

    delay(10);
  }

  turnOffLEDMatrix();
}
