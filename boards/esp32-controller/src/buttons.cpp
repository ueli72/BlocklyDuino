// Made for playground-brumbrum-esp32-s3-devkitc1
#include "buttons.h"
#include "serial.h"

static bool serialInitialized = false;

static void ensureSerialInit() {
    if (!serialInitialized) {
        initSerial(115200);
        serialInitialized = true;
        serialPrintln("\n[Buttons] Serial initialized");
    }
}

void initializeButtons(bool sw1, bool sw2) {
  if (sw1) pinMode(SW1_PIN, INPUT_PULLUP);
  if (sw2) pinMode(SW2_PIN, INPUT_PULLUP);
}

void testButtons() {
  ensureSerialInit();
  
  pinMode(SW1_PIN, INPUT_PULLUP);
  pinMode(SW2_PIN, INPUT_PULLUP);

  serialPrintln("\n========================================");
  serialPrintln("         BUTTON TEST");
  serialPrintln("========================================");

  serialPrintln("[Test] Press Button 1 (SW1)...");
  while (digitalRead(SW1_PIN) == HIGH) {
    delay(10);
  }
  serialPrintln("[OK] Button 1 detected!");
  delay(500);
  // Wait for button release
  while (digitalRead(SW1_PIN) == LOW) {
    delay(10);
  }
  delay(200);

  serialPrintln("[Test] Press Button 2 (SW2)...");
  while (digitalRead(SW2_PIN) == HIGH) {
    delay(10);
  }
  serialPrintln("[OK] Button 2 detected!");
  delay(500);
  // Wait for button release
  while (digitalRead(SW2_PIN) == LOW) {
    delay(10);
  }
  delay(200);

  serialPrintln("========================================");
  serialPrintln("      Button test: ALL OK!");
  serialPrintln("========================================");
  delay(1000);
}
