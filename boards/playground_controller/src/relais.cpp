// Made for playground_controller
#include "relais.h"
#include "buttons.h"
#include "serial.h"

static bool serialInitialized = false;

static void ensureSerialInit() {
    if (!serialInitialized) {
        initSerial(115200);
        serialInitialized = true;
        serialPrintln("\n[Relais] Serial initialized");
    }
}

void setRelay(int relayNum, bool state) {
  int pin;
  if (relayNum == 1) {
    pin = RELAY1_PIN;
  } else if (relayNum == 2) {
    pin = RELAY2_PIN;
  } else {
    return;
  }

  pinMode(pin, OUTPUT);
  digitalWrite(pin, state ? HIGH : LOW);
}


void testRelaisSequence() {
  ensureSerialInit();
  
  serialPrintln("\n========================================");
  serialPrintln("         RELAY TEST");
  serialPrintln("========================================");
  
  for (int i = 0; i < 5; i++) {
    serialPrint("[");
    serialPrint(i + 1);
    serialPrintln("/5] Relay 1: ON");
    setRelay(1, true);
    delay(500);
    serialPrintln("       Relay 1: OFF");
    setRelay(1, false);
    delay(500);
    serialPrintln("       Relay 2: ON");
    setRelay(2, true);
    delay(500);
    serialPrintln("       Relay 2: OFF");
    setRelay(2, false);
    delay(500);
  }
  
  serialPrintln("========================================");
  serialPrintln("      Relay test complete!");
  serialPrintln("========================================");
}
