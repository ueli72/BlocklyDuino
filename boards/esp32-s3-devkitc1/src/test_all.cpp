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
#define SW3_PIN 3
#define SW4_PIN 2

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

void runTestMenu(uint16_t testMask) {
    initOLED();
    
    pinMode(SW1_PIN, INPUT_PULLUP);
    pinMode(SW2_PIN, INPUT_PULLUP);
    pinMode(SW3_PIN, INPUT_PULLUP);
    pinMode(SW4_PIN, INPUT_PULLUP);
    
    TestItem tests[] = {
        {"LED Matrix", TEST_LED_MATRIX, runLEDMatrixTest},
        {"Relais", TEST_RELAIS, testRelaisSequence},
        {"DC Motor", TEST_DC_MOTOR, testDCMotors},
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
        
        snprintf(menuBuffer, sizeof(menuBuffer), "Test Menu\n%s\n%s\n\nSW3:Run SW4:Exit", line1, line2);
        writeToOled(menuBuffer);
        
        delay(20);
        
        if (readButton(SW1_PIN)) {
            waitForButtonRelease(SW1_PIN);
            selectedIndex--;
            if (selectedIndex < 0) selectedIndex = numActive - 1;
        }
        
        if (readButton(SW2_PIN)) {
            waitForButtonRelease(SW2_PIN);
            selectedIndex++;
            if (selectedIndex >= numActive) selectedIndex = 0;
        }
        
        if (readButton(SW3_PIN)) {
            waitForButtonRelease(SW3_PIN);
            
            int testIdx = activeTests[selectedIndex];
            char runBuffer[64];
            snprintf(runBuffer, sizeof(runBuffer), "Running:\n%s", tests[testIdx].name);
            writeToOled(runBuffer);
            delay(500);
            
            tests[testIdx].testFunc();
            
            writeToOled("Test complete!\n\nSW3:Back");
            
            while (!readButton(SW3_PIN) && !readButton(SW4_PIN)) {
                delay(10);
            }
            waitForButtonRelease(SW3_PIN);
            if (readButton(SW4_PIN)) waitForButtonRelease(SW4_PIN);
            
            initOLED();
        }
        
        if (readButton(SW4_PIN)) {
            waitForButtonRelease(SW4_PIN);
            running = false;
        }
    }
    
    clearOled();
}
