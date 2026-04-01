// Made for playground-brumbrum-esp32-s3-devkitc1
#include <Arduino.h>
#include "serial.h"

// ============================================
// Header - User-defined includes and globals
// ============================================

// ============================================
// Includes - Auto-generated from blocks
// ============================================
#include "ble_remote.h"


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
  initSerial(115200);  // Initialize Serial for debugging
  initBLERemote("UelisCar");  // Initialize BLE with device name: UelisCar
  setBLEDirectionCallback(ble_direction_callback);

  serialPrintln("\n========================================");
  serialPrintln("   BrumBrum BLE Car Initialized");
  serialPrintln("========================================");
  serialPrintln("Waiting for BLE connection...");
}

void loop()
{
  // Main program loop
  if (lastdir != dir) {
    lastdir = dir;
    serialPrint("Direction changed: ");
    serialPrintln(dir);
  }
  delay(100);
}
