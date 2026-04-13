// Made for esp32-controller
#include "ky023.h"
#include "oled.h"

void initJoyLeft() {
    pinMode(JOY_LEFT_X_PIN, INPUT);
    pinMode(JOY_LEFT_Y_PIN, INPUT);
    pinMode(JOY_LEFT_SW_PIN, INPUT_PULLUP);
}

void initJoyRight() {
    pinMode(JOY_RIGHT_X_PIN, INPUT);
    pinMode(JOY_RIGHT_Y_PIN, INPUT);
    pinMode(JOY_RIGHT_SW_PIN, INPUT_PULLUP);
}

int readJoyLeftX() {
    return analogRead(JOY_LEFT_X_PIN);
}

int readJoyLeftY() {
    return analogRead(JOY_LEFT_Y_PIN);
}

bool isJoyLeftPressed() {
    return digitalRead(JOY_LEFT_SW_PIN) == LOW;
}

int readJoyRightX() {
    return analogRead(JOY_RIGHT_X_PIN);
}

int readJoyRightY() {
    return analogRead(JOY_RIGHT_Y_PIN);
}

bool isJoyRightPressed() {
    return digitalRead(JOY_RIGHT_SW_PIN) == LOW;
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
