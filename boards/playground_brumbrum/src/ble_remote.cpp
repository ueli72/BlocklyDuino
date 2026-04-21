// Made for playground_brumbrum
#include "ble_remote.h"
#include "serial.h"
#include "buttons.h"
#include <NimBLEDevice.h>

static bool serialInitialized = false;

static void ensureSerialInit() {
    if (!serialInitialized) {
        initSerial(115200);
        serialInitialized = true;
        serialPrintln("\n[BLE] Serial initialized");
    }
}

#define SERVICE_UUID           "00008610-0000-0000-0000-000000000001"  // 8610 = school zip code
#define CHARACTERISTIC_DIRECTION "00008610-0000-0000-0000-000000000002"
#define CHARACTERISTIC_SPEED     "00008610-0000-0000-0000-000000000003"
#define CHARACTERISTIC_COMMAND   "00008610-0000-0000-0000-000000000004"
#define CHARACTERISTIC_SENSOR    "00008610-0000-0000-0000-000000000005"

static NimBLEServer* pServer = nullptr;
static NimBLECharacteristic* pDirectionCharacteristic = nullptr;
static NimBLECharacteristic* pSpeedCharacteristic = nullptr;
static NimBLECharacteristic* pCommandCharacteristic = nullptr;
static NimBLECharacteristic* pSensorCharacteristic = nullptr;

static BLEDirectionCallback directionCallback = nullptr;
static BLESpeedCallback speedCallback = nullptr;
static BLECommandCallback commandCallback = nullptr;
static const char* bleDeviceName = nullptr;

class ServerCallbacks : public NimBLEServerCallbacks {
  void onConnect(NimBLEServer* pServer, NimBLEConnInfo& connInfo) {
    serialPrintln("[BLE] Client connected");
  };
  
  void onDisconnect(NimBLEServer* pServer, NimBLEConnInfo& connInfo, int reason) {
    serialPrintln("[BLE] Client disconnected - restarting advertising");
    NimBLEDevice::startAdvertising();
  };
};

class DirectionCallbackHandler : public NimBLECharacteristicCallbacks {
  void onWrite(NimBLECharacteristic* pCharacteristic, NimBLEConnInfo& connInfo) {
    if (directionCallback) {
      int8_t value = pCharacteristic->getValue<int8_t>();
      directionCallback(value);
    }
  }
};

class SpeedCallbackHandler : public NimBLECharacteristicCallbacks {
  void onWrite(NimBLECharacteristic* pCharacteristic, NimBLEConnInfo& connInfo) {
    if (speedCallback) {
      uint8_t value = pCharacteristic->getValue<uint8_t>();
      speedCallback(value);
    }
  }
};

class CommandCallbackHandler : public NimBLECharacteristicCallbacks {
  void onWrite(NimBLECharacteristic* pCharacteristic, NimBLEConnInfo& connInfo) {
    if (commandCallback) {
      uint8_t value = pCharacteristic->getValue<uint8_t>();
      commandCallback(value);
    }
  }
};

static DirectionCallbackHandler directionHandler;
static SpeedCallbackHandler speedHandler;
static CommandCallbackHandler commandHandler;

void initBLERemote(const char* deviceName) {
  bleDeviceName = deviceName;
  NimBLEDevice::init(deviceName);
  NimBLEDevice::setSecurityAuth(false, false, false);
  
  pServer = NimBLEDevice::createServer();
  pServer->setCallbacks(new ServerCallbacks());
  
  NimBLEService* pService = pServer->createService(SERVICE_UUID);
  
  pDirectionCharacteristic = pService->createCharacteristic(
    CHARACTERISTIC_DIRECTION,
    NIMBLE_PROPERTY::WRITE | NIMBLE_PROPERTY::NOTIFY
  );
  pDirectionCharacteristic->setCallbacks(&directionHandler);
  
  pSpeedCharacteristic = pService->createCharacteristic(
    CHARACTERISTIC_SPEED,
    NIMBLE_PROPERTY::WRITE | NIMBLE_PROPERTY::NOTIFY
  );
  pSpeedCharacteristic->setCallbacks(&speedHandler);
  
  pCommandCharacteristic = pService->createCharacteristic(
    CHARACTERISTIC_COMMAND,
    NIMBLE_PROPERTY::READ | NIMBLE_PROPERTY::WRITE
  );
  pCommandCharacteristic->setValue("");
  pCommandCharacteristic->setCallbacks(&commandHandler);
  
  pSensorCharacteristic = pService->createCharacteristic(
    CHARACTERISTIC_SENSOR,
    NIMBLE_PROPERTY::NOTIFY
  );
  
  NimBLEAdvertising* pAdvertising = NimBLEDevice::getAdvertising();
  pAdvertising->setName(deviceName);
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->start();
  
  serialPrintln("[BLE] BLE Remote initialized - waiting for connection...");
}

void setBLEDirectionCallback(BLEDirectionCallback callback) {
  directionCallback = callback;
}

void setBLESpeedCallback(BLESpeedCallback callback) {
  speedCallback = callback;
}

void setBLECommandCallback(BLECommandCallback callback) {
  commandCallback = callback;
}

void sendBLEData(const char* data) {
  if (pSensorCharacteristic && isBLEConnected()) {
    pSensorCharacteristic->setValue(data);
    pSensorCharacteristic->notify();
  }
}

bool isBLEConnected() {
  return pServer && pServer->getConnectedCount() > 0;
}

#define BLE_TEST_SW1_PIN SW1_PIN
#define BLE_TEST_SW2_PIN SW2_PIN

static int8_t lastDirection = 0;
static uint8_t lastSpeed = 0;
static uint8_t lastCommand = 0;
static bool newDirection = false;
static bool newSpeed = false;
static bool newCommand = false;

static void bleTestDirectionCallback(int8_t dir) {
  lastDirection = dir;
  newDirection = true;
  serialPrint("[BLE] Direction received: ");
  serialPrintln((int)dir);
}

static void bleTestSpeedCallback(uint8_t speed) {
  lastSpeed = speed;
  newSpeed = true;
  serialPrint("[BLE] Speed received: ");
  serialPrintln((int)speed);
}

static void bleTestCommandCallback(uint8_t cmd) {
  lastCommand = cmd;
  newCommand = true;
  serialPrint("[BLE] Command received: ");
  serialPrintln((int)cmd);
}

static void waitForButtonRelease(int pin) {
  delay(20);
  while (digitalRead(pin) == LOW) { delay(5); }
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

void testBLERemote() {
  ensureSerialInit();
  
  pinMode(BLE_TEST_SW1_PIN, INPUT_PULLUP);
  pinMode(BLE_TEST_SW2_PIN, INPUT_PULLUP);
  
  setBLEDirectionCallback(bleTestDirectionCallback);
  setBLESpeedCallback(bleTestSpeedCallback);
  setBLECommandCallback(bleTestCommandCallback);
  
  serialPrintln("\n========================================");
  serialPrintln("         BLE REMOTE TEST");
  serialPrintln("========================================");
  serialPrintln("This test requires the LightBlue app");
  serialPrintln("Controls:");
  serialPrintln("  SW1: Next step / Hold 1s to Exit");
  serialPrintln("  SW2: Skip / Exit");
  serialPrintln("----------------------------------------");
  
  serialPrintln("\n[Step 1] Open LightBlue app on your phone");
  serialPrintln("         then press SW1 to continue...");
  
  // Wait for SW1 or hold to exit
  while (true) {
    if (readButton(BLE_TEST_SW1_PIN)) {
      unsigned long holdStart = millis();
      if (checkHoldExit(BLE_TEST_SW1_PIN, holdStart)) {
        serialPrintln("\n[Exit] Test aborted.");
        return;
      }
      waitForButtonRelease(BLE_TEST_SW1_PIN);
      break;
    }
    if (readButton(BLE_TEST_SW2_PIN)) {
      waitForButtonRelease(BLE_TEST_SW2_PIN);
      serialPrintln("\n[Skip] Skipping test.");
      return;
    }
    delay(10);
  }
  
  serialPrintln("\n[Step 2] LightBlue Setup:");
  serialPrint("         1. Scan devices and find: ");
  serialPrintln(bleDeviceName ? bleDeviceName : "Device");
  serialPrintln("         2. Tap 'Connect'");
  serialPrintln("         Press SW1 to continue...");
  
  while (true) {
    if (readButton(BLE_TEST_SW1_PIN)) {
      unsigned long holdStart = millis();
      if (checkHoldExit(BLE_TEST_SW1_PIN, holdStart)) {
        serialPrintln("\n[Exit] Test aborted.");
        return;
      }
      waitForButtonRelease(BLE_TEST_SW1_PIN);
      break;
    }
    if (readButton(BLE_TEST_SW2_PIN)) {
      waitForButtonRelease(BLE_TEST_SW2_PIN);
      serialPrintln("\n[Skip] Skipping test.");
      return;
    }
    delay(10);
  }
  
  serialPrintln("\n[Step 3] Find service 8610-0001 and expand it");
  serialPrintln("         Press SW1 to continue...");
  
  while (true) {
    if (readButton(BLE_TEST_SW1_PIN)) {
      unsigned long holdStart = millis();
      if (checkHoldExit(BLE_TEST_SW1_PIN, holdStart)) {
        serialPrintln("\n[Exit] Test aborted.");
        return;
      }
      waitForButtonRelease(BLE_TEST_SW1_PIN);
      break;
    }
    if (readButton(BLE_TEST_SW2_PIN)) {
      waitForButtonRelease(BLE_TEST_SW2_PIN);
      serialPrintln("\n[Skip] Skipping test.");
      return;
    }
    delay(10);
  }
  
  serialPrintln("\n[Step 4] Tap characteristic and write hex value");
  serialPrintln("         (no 0x prefix, e.g., 7F)");
  serialPrintln("         Press SW1 when ready to test...");
  
  while (true) {
    if (readButton(BLE_TEST_SW1_PIN)) {
      unsigned long holdStart = millis();
      if (checkHoldExit(BLE_TEST_SW1_PIN, holdStart)) {
        serialPrintln("\n[Exit] Test aborted.");
        return;
      }
      waitForButtonRelease(BLE_TEST_SW1_PIN);
      break;
    }
    if (readButton(BLE_TEST_SW2_PIN)) {
      waitForButtonRelease(BLE_TEST_SW2_PIN);
      serialPrintln("\n[Skip] Skipping test.");
      return;
    }
    delay(10);
  }
  
  serialPrintln("\n[Connect] Waiting for BLE connection...");
  serialPrintln("          Service: 8610-0001");
  serialPrintln("          (Press SW2 to cancel)");
  
  unsigned long startTime = millis();
  while (!isBLEConnected() && millis() - startTime < 60000) {
    if (readButton(BLE_TEST_SW2_PIN)) { 
      waitForButtonRelease(BLE_TEST_SW2_PIN); 
      serialPrintln("\n[Cancel] Connection wait cancelled.");
      return; 
    }
    delay(100);
  }
  
  if (!isBLEConnected()) {
    serialPrintln("\n[Timeout] Connection timeout!");
    serialPrintln("          Press SW2 to exit...");
    while (!readButton(BLE_TEST_SW2_PIN)) { delay(10); }
    waitForButtonRelease(BLE_TEST_SW2_PIN);
    return;
  }
  
  serialPrintln("\n[Connected] BLE client connected!");
  serialPrintln("            Ready to test characteristics.");
  serialPrintln("            Press SW1 to start testing...");
  
  while (true) {
    if (readButton(BLE_TEST_SW1_PIN)) {
      unsigned long holdStart = millis();
      if (checkHoldExit(BLE_TEST_SW1_PIN, holdStart)) {
        serialPrintln("\n[Exit] Test aborted.");
        return;
      }
      waitForButtonRelease(BLE_TEST_SW1_PIN);
      break;
    }
    if (readButton(BLE_TEST_SW2_PIN)) {
      waitForButtonRelease(BLE_TEST_SW2_PIN);
      serialPrintln("\n[Exit] Test cancelled.");
      return;
    }
    delay(10);
  }
  
  const char* testItems[] = {"Direction", "Speed", "Command"};
  int numItems = 3;
  int selectedIndex = 0;
  bool inTestMenu = true;
  unsigned long sw1HoldStart = 0;
  bool sw1WasPressed = false;
  
  while (inTestMenu) {
    serialPrintln("\n----------------------------------------");
    serialPrintln("         TEST MENU");
    serialPrintln("----------------------------------------");
    for (int i = 0; i < numItems; i++) {
      if (i == selectedIndex) {
        serialPrint(" > ");
      } else {
        serialPrint("   ");
      }
      serialPrintln(testItems[i]);
    }
    serialPrintln("----------------------------------------");
    serialPrintln("SW1: Next / Hold 1s to Exit");
    serialPrintln("SW2: Run selected test");
    
    delay(20);
    
    if (readButton(BLE_TEST_SW1_PIN)) {
      if (!sw1WasPressed) {
        sw1HoldStart = millis();
        sw1WasPressed = true;
        
        if (checkHoldExit(BLE_TEST_SW1_PIN, sw1HoldStart)) {
          inTestMenu = false;
          continue;
        }
        
        waitForButtonRelease(BLE_TEST_SW1_PIN);
        selectedIndex = (selectedIndex + 1) % numItems;
      }
    } else {
      sw1WasPressed = false;
    }
    
    if (readButton(BLE_TEST_SW2_PIN)) {
      waitForButtonRelease(BLE_TEST_SW2_PIN);
      
      if (selectedIndex == 0) {
        serialPrintln("\n[DIRECTION TEST] Characteristic: 8610-0002");
        serialPrintln("                 Write hex: 00-FF (80-FF = negative)");
        serialPrintln("                 Press SW2 to exit this test...");
        newDirection = false;
        while (!readButton(BLE_TEST_SW2_PIN)) {
          if (newDirection) {
            serialPrint("                 Received: 0x");
            // Convert to hex manually
            char hexBuf[4];
            uint8_t val = (uint8_t)lastDirection;
            hexBuf[0] = (val >> 4) < 10 ? '0' + (val >> 4) : 'A' + (val >> 4) - 10;
            hexBuf[1] = (val & 0x0F) < 10 ? '0' + (val & 0x0F) : 'A' + (val & 0x0F) - 10;
            hexBuf[2] = '\0';
            serialPrint(hexBuf);
            serialPrint(" (");
            serialPrint((int)lastDirection);
            serialPrintln(")");
            newDirection = false;
          }
          delay(50);
        }
        waitForButtonRelease(BLE_TEST_SW2_PIN);
      }
      else if (selectedIndex == 1) {
        serialPrintln("\n[SPEED TEST] Characteristic: 8610-0003");
        serialPrintln("             Write hex: 00-FF");
        serialPrintln("             Press SW2 to exit this test...");
        newSpeed = false;
        while (!readButton(BLE_TEST_SW2_PIN)) {
          if (newSpeed) {
            serialPrint("             Received: 0x");
            // Convert to hex manually
            char hexBuf[4];
            hexBuf[0] = (lastSpeed >> 4) < 10 ? '0' + (lastSpeed >> 4) : 'A' + (lastSpeed >> 4) - 10;
            hexBuf[1] = (lastSpeed & 0x0F) < 10 ? '0' + (lastSpeed & 0x0F) : 'A' + (lastSpeed & 0x0F) - 10;
            hexBuf[2] = '\0';
            serialPrint(hexBuf);
            serialPrint(" (");
            serialPrint((int)lastSpeed);
            serialPrintln(")");
            newSpeed = false;
          }
          delay(50);
        }
        waitForButtonRelease(BLE_TEST_SW2_PIN);
      }
      else if (selectedIndex == 2) {
        serialPrintln("\n[COMMAND TEST] Characteristic: 8610-0004");
        serialPrintln("               Write hex: 00-FF");
        serialPrintln("               Press SW2 to exit this test...");
        newCommand = false;
        while (!readButton(BLE_TEST_SW2_PIN)) {
          if (newCommand) {
            serialPrint("               Received: 0x");
            // Convert to hex manually
            char hexBuf[4];
            hexBuf[0] = (lastCommand >> 4) < 10 ? '0' + (lastCommand >> 4) : 'A' + (lastCommand >> 4) - 10;
            hexBuf[1] = (lastCommand & 0x0F) < 10 ? '0' + (lastCommand & 0x0F) : 'A' + (lastCommand & 0x0F) - 10;
            hexBuf[2] = '\0';
            serialPrint(hexBuf);
            serialPrint(" (");
            serialPrint((int)lastCommand);
            serialPrintln(")");
            newCommand = false;
          }
          delay(50);
        }
        waitForButtonRelease(BLE_TEST_SW2_PIN);
      }
    }
  }
  
  serialPrintln("\n========================================");
  serialPrintln("      BLE Test Complete!");
  serialPrintln("========================================");
  delay(1500);
}
