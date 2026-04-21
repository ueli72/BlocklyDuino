// Made for playground_master
#include "internalLED.h"

Adafruit_NeoPixel pixel(NUM_PIXELS, RGB_LED_PIN, NEO_GRB + NEO_KHZ800);

void initializeLED() {
  pixel.begin();
  pixel.setBrightness(100);
  turnOffLED();
}

void setLED(uint8_t red, uint8_t green, uint8_t blue) {
  pixel.setPixelColor(0, pixel.Color(red, green, blue));
  pixel.show();
}

void turnOffLED() {
  pixel.setPixelColor(0, pixel.Color(0, 0, 0));
  pixel.show();
}

void showLED() {
  pixel.show();
}

Adafruit_NeoPixel* getPixel() {
  return &pixel;
}

void runLEDInitTest() {
  setLED(50, 0, 0);
  delay(500);
  
  setLED(0, 50, 0);
  delay(500);
  
  setLED(0, 0, 50);
  delay(500);
  
  turnOffLED();
}
