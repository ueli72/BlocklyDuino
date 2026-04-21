// Made for playground_master
#include "ky023.h"
#include "oled.h"

// Static variables to store pin numbers for each joystick
static int joyLeftXPin = JOY_LEFT_X_PIN_DEFAULT;
static int joyLeftYPin = JOY_LEFT_Y_PIN_DEFAULT;
static int joyLeftSwPin = JOY_LEFT_SW_PIN_DEFAULT;

static int joyRightXPin = JOY_RIGHT_X_PIN_DEFAULT;
static int joyRightYPin = JOY_RIGHT_Y_PIN_DEFAULT;
static int joyRightSwPin = JOY_RIGHT_SW_PIN_DEFAULT;

void initJoyLeft(int xPin, int yPin, int swPin) {
    joyLeftXPin = xPin;
    joyLeftYPin = yPin;
    joyLeftSwPin = swPin;
    pinMode(xPin, INPUT);
    pinMode(yPin, INPUT);
    pinMode(swPin, INPUT_PULLUP);
}

void initJoyRight(int xPin, int yPin, int swPin) {
    joyRightXPin = xPin;
    joyRightYPin = yPin;
    joyRightSwPin = swPin;
    pinMode(xPin, INPUT);
    pinMode(yPin, INPUT);
    pinMode(swPin, INPUT_PULLUP);
}

int readJoyLeftX() {
    return analogRead(joyLeftXPin);
}

int readJoyLeftY() {
    return analogRead(joyLeftYPin);
}

bool isJoyLeftPressed() {
    return digitalRead(joyLeftSwPin) == LOW;
}

int readJoyRightX() {
    return analogRead(joyRightXPin);
}

int readJoyRightY() {
    return analogRead(joyRightYPin);
}

bool isJoyRightPressed() {
    return digitalRead(joyRightSwPin) == LOW;
}

void testJoyLeft() {
    // Show instructions
    writeToOled("JoyLeft Test\nMove joystick\nPress btn");
    delay(1000);
    
    // Test until button pressed (max 60 seconds = 300 iterations at 200ms)
    int maxIterations = 300;
    int iteration = 0;
    
    while (!isJoyLeftPressed() && iteration < maxIterations) {
        int x = readJoyLeftX();
        int y = readJoyLeftY();
        
        writeToOled("X:%d\nY:%d\nBtn:%s", x, y, isJoyLeftPressed() ? "YES" : "no");
        
        delay(200);
        iteration++;
    }
}

void testJoyRight() {
    // Show instructions
    writeToOled("JoyRight Test\nMove joystick\nPress btn");
    delay(1000);
    
    // Test until button pressed (max 60 seconds = 300 iterations at 200ms)
    int maxIterations = 300;
    int iteration = 0;
    
    while (!isJoyRightPressed() && iteration < maxIterations) {
        int x = readJoyRightX();
        int y = readJoyRightY();
        
        writeToOled("X:%d\nY:%d\nBtn:%s", x, y, isJoyRightPressed() ? "YES" : "no");
        
        delay(200);
        iteration++;
    }
}

void testKY023() {
    initOLED();  // Initialize OLED display for testing
    testJoyLeft();
    // No delay between tests
    testJoyRight();
    clearOled();
}
