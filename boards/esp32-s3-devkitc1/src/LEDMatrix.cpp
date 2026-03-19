#include "LEDMatrix.h"

// Create NeoPixel object for LED Matrix
Adafruit_NeoPixel ledMatrix(NUM_LEDS, LED_MATRIX_PIN, NEO_GRB + NEO_KHZ800);

void initializeLEDMatrix() {
  ledMatrix.begin();
  ledMatrix.setBrightness(100); // Set brightness (0-255)
  turnOffLEDMatrix();
}

void setLEDMatrixPixel(uint8_t index, uint8_t red, uint8_t green, uint8_t blue) {
  if (index < NUM_LEDS) {
    ledMatrix.setPixelColor(index, ledMatrix.Color(red, green, blue));
  }
}

void turnOffLEDMatrix() {
  for (uint8_t i = 0; i < NUM_LEDS; i++) {
    ledMatrix.setPixelColor(i, ledMatrix.Color(0, 0, 0));
  }
  ledMatrix.show();
}

void showLEDMatrix() {
  ledMatrix.show();
}

Adafruit_NeoPixel* getLEDMatrix() {
  return &ledMatrix;
}

void runLEDMatrixTest() {
  Serial.println("Running LED Matrix test...");
  Serial.println("Turning on LEDs one by one with white color (200ms delay)");
  
  // Turn off all LEDs first
  turnOffLEDMatrix();
  delay(100);
  
  // Light up each LED with white color (200ms delay between LEDs)
  for (uint8_t i = 0; i < NUM_LEDS; i++) {
    Serial.print("LED Matrix: Pixel ");
    Serial.println(i);
    setLEDMatrixPixel(i, 255, 255, 255); // White color
    showLEDMatrix();
    delay(200);
  }
  
  // Turn off all LEDs after test
  Serial.println("LED Matrix test complete - turning off");
  turnOffLEDMatrix();
}
