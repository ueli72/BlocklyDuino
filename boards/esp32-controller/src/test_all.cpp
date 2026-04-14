// Made for esp32-controller
#include "test_all.h"
#include "oled.h"
#include "internalLED.h"
#include "buttons.h"
#include "haptic.h"
#include "ky023.h"

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

static void testHapticWrapper() {
    writeToOled("Haptic Test\n500ms...");
    hapticVibrate(500);
    delay(600);
    writeToOled("Haptic Test\n1000ms...");
    hapticVibrate(1000);
    delay(1100);
    writeToOled("Haptic Test\nDone!");
    delay(500);
}

void runTestMenu(uint16_t testMask) {
    initOLED();
    
    pinMode(SW1_PIN, INPUT_PULLUP);
    pinMode(SW2_PIN, INPUT_PULLUP);
    
    TestItem tests[] = {
        {"OLED", TEST_OLED, testOLED},
        {"LED", TEST_INTERNAL_LED, runLEDInitTest},
        {"Buttons", TEST_BUTTONS, testButtons},
        {"Haptic", TEST_HAPTIC, testHapticWrapper},
        {"KY023", TEST_KY023, testKY023}
    };
    
    int numTests = sizeof(tests) / sizeof(tests[0]);
    int activeTests[5];
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
        char menuBuffer[128];
        char line1[32] = "";
        char line2[32] = "";
        
        int testIdx1 = activeTests[selectedIndex];
        int testIdx2 = (selectedIndex + 1 < numActive) ? activeTests[selectedIndex + 1] : -1;
        
        snprintf(line1, sizeof(line1), "> %s", tests[testIdx1].name);
        if (testIdx2 >= 0) {
            snprintf(line2, sizeof(line2), "  %s", tests[testIdx2].name);
        }
        
        snprintf(menuBuffer, sizeof(menuBuffer), "Test Menu\n%s\n%s\n\nSW1:Next SW2:Run\nHold SW1=Exit", line1, line2);
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
            char runBuffer[32];
            snprintf(runBuffer, sizeof(runBuffer), "Running:\n%s", tests[testIdx].name);
            writeToOled(runBuffer);
            delay(500);
            
            tests[testIdx].testFunc();
            
            writeToOled("Test done!\n\nSW2:Back");
            
            while (!readButton(SW2_PIN)) {
                delay(10);
            }
            waitForButtonRelease(SW2_PIN);
            
            initOLED();
        }
    }
    
    clearOled();
}
