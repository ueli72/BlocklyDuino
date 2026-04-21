// Made for playground_brumbrum
#include "test_all.h"
#include "serial.h"
#include "buttons.h"
#include "dcmotor.h"
#include "ultrasonic.h"
#include "sdcard.h"
#include "max98357a.h"
#include "internalLED.h"
#include "servos.h"

static bool serialInitialized = false;

static void ensureSerialInit() {
    if (!serialInitialized) {
        initSerial(115200);
        serialInitialized = true;
        serialPrintln("\n****************************************");
        serialPrintln("*       BRUMBRUM TEST SYSTEM           *");
        serialPrintln("****************************************");
        serialPrintln("*  IMPORTANT: Serial Monitor Required  *");
        serialPrintln("*                                      *");
        serialPrintln("*  Connect to COM port (NOT USB-CDC)   *");
        serialPrintln("*  Baud rate: 115200                   *");
        serialPrintln("*                                      *");
        serialPrintln("*  Open Serial Monitor to select     *");
        serialPrintln("*  tests by entering numbers 1-6     *");
        serialPrintln("****************************************");
    }
}

void printMenu() {
    serialPrintln("\n================================");
    serialPrintln("       BRUMBRUM TEST MENU       ");
    serialPrintln("================================");
    serialPrintln("1 - DC Motors");
    serialPrintln("2 - Ultrasonic");
    serialPrintln("3 - SD Card");
    serialPrintln("4 - MAX98357A (Audio)");
    serialPrintln("5 - Internal LED");
    serialPrintln("6 - SG90 Servo");
    serialPrintln("================================");
    serialPrint("Enter your choice (1-6): ");
}

int readMenuChoice() {
    while (!Serial.available()) {
        delay(10);
    }
    
    int choice = Serial.parseInt();
    while (Serial.available()) {
        Serial.read();
    }
    
    return choice;
}

void runTestMenu(uint16_t testMask) {
    ensureSerialInit();
    
    // Filter tests based on mask
    bool hasTests = false;
    if (testMask & TEST_DC_MOTOR) hasTests = true;
    if (testMask & TEST_ULTRASONIC) hasTests = true;
    if (testMask & TEST_SD_CARD) hasTests = true;
    if (testMask & TEST_MAX98357A) hasTests = true;
    if (testMask & TEST_INTERNAL_LED) hasTests = true;
    if (testMask & TEST_SG90_SERVO) hasTests = true;
    
    if (!hasTests) {
        serialPrintln("\n[ERROR] No tests selected!");
        delay(2000);
        return;
    }
    
    while (true) {
        printMenu();
        int choice = readMenuChoice();
        serialPrintln(choice);
        
        if (choice >= 1 && choice <= 6) {
            bool testSelected = false;
            
            if (choice == 1 && (testMask & TEST_DC_MOTOR)) {
                serialPrintln("\n--- Starting DC Motor Test ---");
                testDCMotors(0x0F);
                serialPrintln("--- DC Motor Test Complete ---");
                testSelected = true;
            }
            else if (choice == 2 && (testMask & TEST_ULTRASONIC)) {
                serialPrintln("\n--- Starting Ultrasonic Test ---");
                testUltrasonicOLED();
                serialPrintln("--- Ultrasonic Test Complete ---");
                testSelected = true;
            }
            else if (choice == 3 && (testMask & TEST_SD_CARD)) {
                serialPrintln("\n--- Starting SD Card Test ---");
                testSDCard();
                serialPrintln("--- SD Card Test Complete ---");
                testSelected = true;
            }
            else if (choice == 4 && (testMask & TEST_MAX98357A)) {
                serialPrintln("\n--- Starting MAX98357A Audio Test ---");
                testMAX98357A();
                serialPrintln("--- MAX98357A Audio Test Complete ---");
                testSelected = true;
            }
            else if (choice == 5 && (testMask & TEST_INTERNAL_LED)) {
                serialPrintln("\n--- Starting Internal LED Test ---");
                runLEDInitTest();
                serialPrintln("--- Internal LED Test Complete ---");
                testSelected = true;
            }
            else if (choice == 6 && (testMask & TEST_SG90_SERVO)) {
                serialPrintln("\n--- Starting SG90 Servo Test ---");
                testServos();
                serialPrintln("--- SG90 Servo Test Complete ---");
                testSelected = true;
            }
            
            if (!testSelected) {
                serialPrintln("\n[WARNING] Test not enabled in mask or invalid choice!");
            }
        }
        else if (choice == 0) {
            serialPrintln("\n[Exit] Exiting test menu...");
            break;
        }
        else {
            serialPrintln("\n[ERROR] Invalid choice! Please enter 1-6 (or 0 to exit).");
        }
        
        delay(500);
    }
    
    serialPrintln("\n[Exit] Test menu closed.");
}
