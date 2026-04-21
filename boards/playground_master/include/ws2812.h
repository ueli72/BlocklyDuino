// Made for playground_master
#ifndef WS2812_H
#define WS2812_H

#include <Arduino.h>
#include <Adafruit_NeoPixel.h>

void initWS2812(int pin, int count);
void setWS2812Pixel(uint16_t index, uint8_t red, uint8_t green, uint8_t blue);
void fillWS2812(uint8_t red, uint8_t green, uint8_t blue);
void showWS2812();
void turnOffWS2812();
void testWS2812();
Adafruit_NeoPixel* getWS2812();

#endif // WS2812_H
