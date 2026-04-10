// Made for esp32-controller
#include "internalLED.h"

void initializeLED() {
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, HIGH);
}

void turnOnLED() {
  digitalWrite(LED_PIN, LOW);
}

void turnOffLED() {
  digitalWrite(LED_PIN, HIGH);
}

void runLEDInitTest() {
  turnOnLED();
  delay(500);
  turnOffLED();
  delay(500);
  turnOnLED();
  delay(500);
  turnOffLED();
}
