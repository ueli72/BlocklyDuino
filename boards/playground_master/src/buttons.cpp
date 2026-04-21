// Made for playground_master
#include "buttons.h"
#include "oled.h"

void initializeButtons(bool sw1, bool sw2, bool sw3, bool sw4) {
  if (sw1) pinMode(SW1_PIN, INPUT_PULLUP);
  if (sw2) pinMode(SW2_PIN, INPUT_PULLUP);
  if (sw3) pinMode(SW3_PIN, INPUT_PULLUP);
  if (sw4) pinMode(SW4_PIN, INPUT_PULLUP);
}

void testButtons() {
  pinMode(SW1_PIN, INPUT_PULLUP);
  pinMode(SW2_PIN, INPUT_PULLUP);
  pinMode(SW3_PIN, INPUT_PULLUP);
  pinMode(SW4_PIN, INPUT_PULLUP);

  // Show test title
  writeToOled("Buttontest");
  delay(1000);

  // Test Button 1
  writeToOled("Buttontest\nPress Button 1");
  while (digitalRead(SW1_PIN) == HIGH) {
    delay(10);
  }
  writeToOled("Buttontest\nButton 1 OK");
  delay(500);
  // Wait for button release
  while (digitalRead(SW1_PIN) == LOW) {
    delay(10);
  }
  delay(200);

  // Test Button 2
  writeToOled("Buttontest\nPress Button 2");
  while (digitalRead(SW2_PIN) == HIGH) {
    delay(10);
  }
  writeToOled("Buttontest\nButton 2 OK");
  delay(500);
  // Wait for button release
  while (digitalRead(SW2_PIN) == LOW) {
    delay(10);
  }
  delay(200);

  // Test Button 3
  writeToOled("Buttontest\nPress Button 3");
  while (digitalRead(SW3_PIN) == HIGH) {
    delay(10);
  }
  writeToOled("Buttontest\nButton 3 OK");
  delay(500);
  // Wait for button release
  while (digitalRead(SW3_PIN) == LOW) {
    delay(10);
  }
  delay(200);

  // Test Button 4
  writeToOled("Buttontest\nPress Button 4");
  while (digitalRead(SW4_PIN) == HIGH) {
    delay(10);
  }
  writeToOled("Buttontest\nButton 4 OK");
  delay(500);
  // Wait for button release
  while (digitalRead(SW4_PIN) == LOW) {
    delay(10);
  }
  delay(200);

  // Final message
  writeToOled("Buttontest\nAll OK!");
  delay(1000);
  clearOled();
}
