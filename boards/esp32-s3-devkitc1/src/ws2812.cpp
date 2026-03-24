#include "ws2812.h"

static Adafruit_NeoPixel* ws2812Strip = nullptr;
static int ledCount = 0;

void initWS2812(int pin, int count) {
  if (ws2812Strip != nullptr) {
    delete ws2812Strip;
  }
  ledCount = count;
  ws2812Strip = new Adafruit_NeoPixel(count, pin, NEO_GRB + NEO_KHZ800);
  ws2812Strip->begin();
  ws2812Strip->show();
}

void setWS2812Pixel(uint16_t index, uint8_t red, uint8_t green, uint8_t blue) {
  if (ws2812Strip != nullptr && index < ledCount) {
    ws2812Strip->setPixelColor(index, ws2812Strip->Color(red, green, blue));
  }
}

void fillWS2812(uint8_t red, uint8_t green, uint8_t blue) {
  if (ws2812Strip != nullptr) {
    ws2812Strip->fill(ws2812Strip->Color(red, green, blue));
  }
}

void showWS2812() {
  if (ws2812Strip != nullptr) {
    ws2812Strip->show();
  }
}

void turnOffWS2812() {
  if (ws2812Strip != nullptr) {
    ws2812Strip->clear();
    ws2812Strip->show();
  }
}

void testWS2812() {
  if (ws2812Strip == nullptr) return;
  
  for (int j = 0; j < 3; j++) {
    for (int i = 0; i < ledCount; i++) {
      ws2812Strip->setPixelColor(i, ws2812Strip->Color(255, 0, 0));
    }
    ws2812Strip->show();
    delay(500);
    
    for (int i = 0; i < ledCount; i++) {
      ws2812Strip->setPixelColor(i, ws2812Strip->Color(0, 255, 0));
    }
    ws2812Strip->show();
    delay(500);
    
    for (int i = 0; i < ledCount; i++) {
      ws2812Strip->setPixelColor(i, ws2812Strip->Color(0, 0, 255));
    }
    ws2812Strip->show();
    delay(500);
  }
  
  turnOffWS2812();
}

Adafruit_NeoPixel* getWS2812() {
  return ws2812Strip;
}
