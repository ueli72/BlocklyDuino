#include "internalLED.h"

// Create NeoPixel object
Adafruit_NeoPixel pixel(NUM_PIXELS, RGB_LED_PIN, NEO_GRB + NEO_KHZ800);

void initializeLED() {
  pixel.begin();
  pixel.setBrightness(100); // Set brightness (0-255)
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
  Serial.println("Running LED initialization test...");
  
  // Test sequence: Red -> Green -> Blue (500ms each)
  Serial.println("LED: RED");
  setLED(50, 0, 0);     // Red with reduced brightness
  delay(500);
  
  Serial.println("LED: GREEN"); 
  setLED(0, 50, 0);     // Green with reduced brightness
  delay(500);
  
  Serial.println("LED: BLUE");
  setLED(0, 0, 50);     // Blue with reduced brightness
  delay(500);
  
  // Turn off LED after test
  Serial.println("LED test complete - turning off");
  turnOffLED();
}
