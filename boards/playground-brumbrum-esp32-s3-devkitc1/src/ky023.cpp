#include "ky023.h"
#include "oled.h"

static int _ky023_xPin = 0;
static int _ky023_yPin = 0;
static int _ky023_buttonPin = 0;

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
    writeToOled("KY023 Test\nMove joystick\nAuto-stops in 10s");
    delay(2000);
    
    for (int i = 0; i < 50; i++) {
        int x = readKY023X();
        int y = readKY023Y();
        bool button = isKY023ButtonPressed();
        
        writeToOled("X: %d\nY: %d\nButton: %s", x, y, button ? "PRESSED" : "released");
        
        delay(200);
    }
    
    clearOled();
}
