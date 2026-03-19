#include "relais.h"
#include "LEDMatrix.h"
#include "buttons.h"

// Function to set relay state
void setRelay(int relayNum, bool state) {
  int pin;
  if (relayNum == 1) {
    pin = RELAY1_PIN;
  } else if (relayNum == 2) {
    pin = RELAY2_PIN;
  } else {
    return; // Invalid relay
  }

  pinMode(pin, OUTPUT);
  digitalWrite(pin, state ? HIGH : LOW);
}

// Test function for relays
void testRelays() {
  // Initialize relays to OFF
  setRelay(1, false);
  setRelay(2, false);

  // Configure button pins
  pinMode(SW1_PIN, INPUT_PULLUP);
  pinMode(SW2_PIN, INPUT_PULLUP);
  pinMode(SW3_PIN, INPUT_PULLUP);

  // Turn off all LEDs
  turnOffLEDMatrix();

  bool prevRelay1State = false;
  bool prevRelay2State = false;

  Serial.println("Relay Test Started");
  Serial.println("Hold SW1 (GPIO1) to activate Relay1");
  Serial.println("Hold SW2 (GPIO4) to activate Relay2");
  Serial.println("Press SW3 (GPIO3) to end test");
  Serial.println("LED1 lights when Relay1 is ON, LED2 when Relay2 is ON");

  bool running = true;
  while (running) {
    bool sw1Pressed = (digitalRead(SW1_PIN) == LOW);
    bool sw2Pressed = (digitalRead(SW2_PIN) == LOW);

    // Set Relay1
    setRelay(1, sw1Pressed);
    if (sw1Pressed) {
      setLEDMatrixPixel(0, 255, 255, 255); // LED1 white
    } else {
      setLEDMatrixPixel(0, 0, 0, 0); // LED1 off
    }

    // Set Relay2
    setRelay(2, sw2Pressed);
    if (sw2Pressed) {
      setLEDMatrixPixel(1, 255, 255, 255); // LED2 white
    } else {
      setLEDMatrixPixel(1, 0, 0, 0); // LED2 off
    }

    showLEDMatrix();

    // Serial output only on state change
    if (sw1Pressed != prevRelay1State) {
      Serial.print("Relay1 ");
      Serial.println(sw1Pressed ? "ON" : "OFF");
      prevRelay1State = sw1Pressed;
    }
    if (sw2Pressed != prevRelay2State) {
      Serial.print("Relay2 ");
      Serial.println(sw2Pressed ? "ON" : "OFF");
      prevRelay2State = sw2Pressed;
    }

    if (digitalRead(SW3_PIN) == LOW) {
      Serial.println("Relay test ended");
      running = false;
      delay(200); // Debounce
    }

    delay(50); // Small delay to avoid too frequent checks
  }

  // Turn off LEDs at end
  setLEDMatrixPixel(0, 0, 0, 0);
  setLEDMatrixPixel(1, 0, 0, 0);
  showLEDMatrix();
}