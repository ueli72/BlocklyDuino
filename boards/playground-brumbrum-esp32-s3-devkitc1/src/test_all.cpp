#include "test_all.h"
#include "oled.h"
#include "buttons.h"
#include "LEDMatrix.h"
#include "relais.h"
#include "dcmotor.h"
#include "dht11.h"
#include "ultrasonic.h"
#include "sdcard.h"
#include "max98357a.h"
#include "internalLED.h"
#include "servos.h"

#define SW1_PIN 1
#define SW2_PIN 4

typedef struct {
    const char* name;
    uint16_t bit;
    void (*testFunc)();
} TestItem;

static void waitForButtonRelease(int pin) {
    delay(20);
    while (digitalRead(pin) == LOW) {
        delay(5);
    }
    delay(20);
}

static bool readButton(int pin) {
    return digitalRead(pin) == LOW;
}

static bool checkHoldExit(int pin, unsigned long holdStart) {
    while (digitalRead(pin) == LOW) {
        if (millis() - holdStart >= 1000) {
            waitForButtonRelease(pin);
            return true;
        }
        delay(10);
    }
    return false;
}

static void testDCMotorsWrapper() {
    testDCMotors(0x0F);
}

void runTestMenu(uint16_t testMask) {
    initOLED();
    
    pinMode(SW1_PIN, INPUT_PULLUP);
    pinMode(SW2_PIN, INPUT_PULLUP);
    
    TestItem tests[] = {
        {"LED Matrix", TEST_LED_MATRIX, runLEDMatrixTest},
        {"Relais", TEST_RELAIS, testRelaisSequence},
        {"DC Motor", TEST_DC_MOTOR, testDCMotorsWrapper},
        {"DHT11", TEST_DHT11, testDHT11},
        {"Ultrasonic", TEST_ULTRASONIC, testUltrasonicOLED},
        {"SD Card", TEST_SD_CARD, testSDCard},
        {"MAX98357A", TEST_MAX98357A, testMAX98357A},
        {"Internal LED", TEST_INTERNAL_LED, runLEDInitTest},
        {"SG90 Servo", TEST_SG90_SERVO, testServos}
    };
    
    int numTests = sizeof(tests) / sizeof(tests[0]);
    int activeTests[9];
    int numActive = 0;
    
    for (int i = 0; i < numTests; i++) {
        if (testMask & tests[i].bit) {
            activeTests[numActive++] = i;
        }
    }
    
    if (numActive == 0) {
        writeToOled("No tests\nselected!");
        delay(2000);
        return;
    }
    
    int selectedIndex = 0;
    bool running = true;
    unsigned long sw1HoldStart = 0;
    bool sw1WasPressed = false;
    
    while (running) {
        char menuBuffer[256];
        char line1[64] = "";
        char line2[64] = "";
        
        int testIdx1 = activeTests[selectedIndex];
        int testIdx2 = (selectedIndex + 1 < numActive) ? activeTests[selectedIndex + 1] : -1;
        
        snprintf(line1, sizeof(line1), "> %s", tests[testIdx1].name);
        if (testIdx2 >= 0) {
            snprintf(line2, sizeof(line2), "  %s", tests[testIdx2].name);
        }
        
        snprintf(menuBuffer, sizeof(menuBuffer), "Test Menu\n%s\n%s\n\nSW1:Scroll SW2:Run\n(hold SW1=Exit)", line1, line2);
        writeToOled(menuBuffer);
        
        delay(20);
        
        if (readButton(SW1_PIN)) {
            if (!sw1WasPressed) {
                sw1HoldStart = millis();
                sw1WasPressed = true;
                
                if (checkHoldExit(SW1_PIN, sw1HoldStart)) {
                    running = false;
                    continue;
                }
                
                waitForButtonRelease(SW1_PIN);
                selectedIndex++;
                if (selectedIndex >= numActive) selectedIndex = 0;
            }
        } else {
            sw1WasPressed = false;
        }
        
        if (readButton(SW2_PIN)) {
            waitForButtonRelease(SW2_PIN);
            
            int testIdx = activeTests[selectedIndex];
            char runBuffer[64];
            snprintf(runBuffer, sizeof(runBuffer), "Running:\n%s", tests[testIdx].name);
            writeToOled(runBuffer);
            delay(500);
            
            tests[testIdx].testFunc();
            
            writeToOled("Test complete!\n\nSW2:Back");
            
            while (!readButton(SW2_PIN)) {
                delay(10);
            }
            waitForButtonRelease(SW2_PIN);
            
            initOLED();
        }
    }
    
    clearOled();
}
