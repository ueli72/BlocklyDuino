// Made for esp32-controller
#include "ky023.h"
#include "serial.h"

static bool serialInitialized = false;

static void ensureSerialInit() {
    if (!serialInitialized) {
        initSerial(115200);
        serialInitialized = true;
        serialPrintln("\n[KY023] Serial initialized");
    }
}

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
    ensureSerialInit();
    
    serialPrintln("\n========================================");
    serialPrintln("       JOYLEFT KY023 TEST");
    serialPrintln("========================================");
    serialPrintln("Move JoyLeft and press button...");
    serialPrintln("Test runs for 10 seconds");
    serialPrintln("----------------------------------------");
    
    for (int i = 0; i < 50; i++) {
        int x = readJoyLeftX();
        int y = readJoyLeftY();
        bool button = isJoyLeftPressed();
        
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
    serialPrintln("JoyLeft test complete!");
    serialPrintln("========================================");
}

void testJoyRight() {
    ensureSerialInit();
    
    serialPrintln("\n========================================");
    serialPrintln("       JOYRIGHT KY023 TEST");
    serialPrintln("========================================");
    serialPrintln("Move JoyRight and press button...");
    serialPrintln("Test runs for 10 seconds");
    serialPrintln("----------------------------------------");
    
    for (int i = 0; i < 50; i++) {
        int x = readJoyRightX();
        int y = readJoyRightY();
        bool button = isJoyRightPressed();
        
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
    serialPrintln("JoyRight test complete!");
    serialPrintln("========================================");
}

void testKY023() {
    testJoyLeft();
    delay(500);
    testJoyRight();
}
