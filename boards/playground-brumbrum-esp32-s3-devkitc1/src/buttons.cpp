// Made for playground-brumbrum-esp32-s3-devkitc1
#include "buttons.h"
#include "oled.h"

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

  writeToOled("Button test\nPress SW1 & SW2");

  while (!(sw1Pressed && sw2Pressed)) {
    if (!sw1Pressed && digitalRead(SW1_PIN) == LOW) {
      sw1Pressed = true;
      writeToOled("SW1 pressed\nHold SW2");
      delay(300);
    }

    if (!sw2Pressed && digitalRead(SW2_PIN) == LOW) {
      sw2Pressed = true;
      writeToOled("SW2 pressed\nHold SW1");
      delay(300);
    }

    delay(20);
  }

  writeToOled("Buttons ready!\nRelease to end");
  delay(800);
  clearOled();
}
