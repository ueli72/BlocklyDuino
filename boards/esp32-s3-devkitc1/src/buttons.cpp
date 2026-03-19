#include "buttons.h"
#include "LEDMatrix.h"

// Button states
bool sw1Pressed = false;
bool sw2Pressed = false;
bool sw3Pressed = false;
bool sw4Pressed = false;

void testButtons() {
  // Configure buttons as INPUT_PULLUP
  pinMode(SW1_PIN, INPUT_PULLUP);
  pinMode(SW2_PIN, INPUT_PULLUP);
  pinMode(SW3_PIN, INPUT_PULLUP);
  pinMode(SW4_PIN, INPUT_PULLUP);

  // Turn off all LEDs initially
  turnOffLEDMatrix();

  Serial.println("Button Test Started");
  Serial.println("Press each button once:");
  Serial.println("SW1 (GPIO 1) -> LED1 white");
  Serial.println("SW2 (GPIO 4) -> LED2 white");
  Serial.println("SW3 (GPIO 3) -> LED3 white");
  Serial.println("SW4 (GPIO 2) -> LED4 white");
  Serial.println("Buttons are configured with pull-up, press = LOW");

  while (!(sw1Pressed && sw2Pressed && sw3Pressed && sw4Pressed)) {
    // Check SW1
    if (!sw1Pressed && digitalRead(SW1_PIN) == LOW) {
      sw1Pressed = true;
      setLEDMatrixPixel(0, 255, 255, 255); // LED1 white
      showLEDMatrix();
      Serial.println("SW1 pressed - LED1 on");
      delay(200); // Debounce
    }

    // Check SW2
    if (!sw2Pressed && digitalRead(SW2_PIN) == LOW) {
      sw2Pressed = true;
      setLEDMatrixPixel(1, 255, 255, 255); // LED2 white
      showLEDMatrix();
      Serial.println("SW2 pressed - LED2 on");
      delay(200); // Debounce
    }

    // Check SW3
    if (!sw3Pressed && digitalRead(SW3_PIN) == LOW) {
      sw3Pressed = true;
      setLEDMatrixPixel(2, 255, 255, 255); // LED3 white
      showLEDMatrix();
      Serial.println("SW3 pressed - LED3 on");
      delay(200); // Debounce
    }

    // Check SW4
    if (!sw4Pressed && digitalRead(SW4_PIN) == LOW) {
      sw4Pressed = true;
      setLEDMatrixPixel(3, 255, 255, 255); // LED4 white
      showLEDMatrix();
      Serial.println("SW4 pressed - LED4 on");
      delay(200); // Debounce
    }

    delay(10); // Small delay to avoid busy loop
  }

  Serial.println("All buttons pressed! Test complete.");
  turnOffLEDMatrix();
}