// Made for playground-brumbrum-esp32-s3-devkitc1
#include <Arduino.h>
#include "oled.h"

// ============================================
// Header - User-defined includes and globals
// ============================================

// ============================================
// Includes - Auto-generated from blocks
// ============================================
#include "ble_remote.h"

#include "oled.h"


// ============================================
// Global Variables and Objects
// ============================================
int lastdir;

volatile int dir = 0;

// BLE callback: called when direction changes from remote
void ble_direction_callback(int8_t direction)
{
  dir = direction;
}


// ============================================
// Arduino Entry Points
// ============================================

void setup()
{
  // Initialize hardware and peripherals
  initBLERemote("UelisCar");  // Initialize BLE with device name: UelisCar
  initOLED();  // Initialize OLED display
  setBLEDirectionCallback(ble_direction_callback);

}

void loop()
{
  // Main program loop
  if (lastdir != dir) {
    lastdir = dir;
    writeToOled("%d", dir);

  }
  delay(100);
}
