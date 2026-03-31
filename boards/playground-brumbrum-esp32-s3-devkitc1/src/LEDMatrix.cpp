#include "LEDMatrix.h"

Adafruit_NeoPixel ledMatrix(NUM_LEDS, LED_MATRIX_PIN, NEO_GRB + NEO_KHZ800);

void initializeLEDMatrix() {
  ledMatrix.begin();
  ledMatrix.setBrightness(100);
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
  turnOffLEDMatrix();
  delay(100);
  
  for (uint8_t i = 0; i < NUM_LEDS; i++) {
    uint8_t pos = (i * 256 / NUM_LEDS);
    uint8_t red, green, blue;
    
    if (pos < 85) {
      red = pos * 3;
      green = 255 - pos * 3;
      blue = 0;
    } else if (pos < 170) {
      pos -= 85;
      red = 255 - pos * 3;
      green = 0;
      blue = pos * 3;
    } else {
      pos -= 170;
      red = 0;
      green = pos * 3;
      blue = 255 - pos * 3;
    }
    
    setLEDMatrixPixel(i, red, green, blue);
    showLEDMatrix();
    delay(200);
  }
  
  turnOffLEDMatrix();
}
