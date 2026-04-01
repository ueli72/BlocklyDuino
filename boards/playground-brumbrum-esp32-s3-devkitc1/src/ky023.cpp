// Made for playground-brumbrum-esp32-s3-devkitc1
#include "ky023.h"
#include "serial.h"

static int _ky023_xPin = 0;
static int _ky023_yPin = 0;
static int _ky023_buttonPin = 0;

static bool serialInitialized = false;

static void ensureSerialInit() {
    if (!serialInitialized) {
        initSerial(115200);
        serialInitialized = true;
        serialPrintln("\n[KY023] Serial initialized");
    }
}

void initKY023(int xPin, int yPin, int buttonPin) {
    _ky023_xPin = xPin;
    _ky023_yPin = yPin;
    _ky023_buttonPin = buttonPin;
    
    pinMode(_ky023_buttonPin, INPUT_PULLUP);
}

int readKY023X() {
    int rawValue = analogRead(_ky023_xPin);
    int mappedValue = map(rawValue, 0, 4095, 0, 255);
    return mappedValue - 128;
}

int readKY023Y() {
    int rawValue = analogRead(_ky023_yPin);
    int mappedValue = map(rawValue, 0, 4095, 0, 255);
    return mappedValue - 128;
}

bool isKY023ButtonPressed() {
    return digitalRead(_ky023_buttonPin) == LOW;
}

void testKY023() {
    ensureSerialInit();
    
    serialPrintln("\n========================================");
    serialPrintln("       KY023 JOYSTICK TEST");
    serialPrintln("========================================");
    serialPrintln("Move joystick and press button...");
    serialPrintln("Test runs for 10 seconds");
    serialPrintln("----------------------------------------");
    
    for (int i = 0; i < 50; i++) {
        int x = readKY023X();
        int y = readKY023Y();
        bool button = isKY023ButtonPressed();
        
        serialPrint("[");
        serialPrint(i / 5 + 1);
        serialPrint("/10] X: ");
        serialPrint(x);
        serialPrint(" Y: ");
        serialPrint(y);
        serialPrint(" Button: ");
        serialPrintln(button ? "PRESSED" : "released");
        
        delay(200);
    }
    
    serialPrintln("----------------------------------------");
    serialPrintln("KY023 Joystick test complete!");
    serialPrintln("========================================");
}
