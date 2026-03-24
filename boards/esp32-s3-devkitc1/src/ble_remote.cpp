#include "ble_remote.h"
#include "oled.h"
#include <NimBLEDevice.h>

#define SERVICE_UUID           "8001"
#define CHARACTERISTIC_DIRECTION "8002"
#define CHARACTERISTIC_SPEED     "8003"
#define CHARACTERISTIC_COMMAND   "8004"
#define CHARACTERISTIC_SENSOR    "8005"

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
    Serial.println("BLE client connected");
  };
  
  void onDisconnect(NimBLEServer* pServer, NimBLEConnInfo& connInfo, int reason) {
    Serial.println("BLE client disconnected - restarting advertising");
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
  
  Serial.println("BLE Remote initialized - waiting for connection...");
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

#define BLE_TEST_SW1_PIN 1
#define BLE_TEST_SW2_PIN 4

static int8_t lastDirection = 0;
static uint8_t lastSpeed = 0;
static uint8_t lastCommand = 0;
static bool newDirection = false;
static bool newSpeed = false;
static bool newCommand = false;

static void bleTestDirectionCallback(int8_t dir) {
  lastDirection = dir;
  newDirection = true;
}

static void bleTestSpeedCallback(uint8_t speed) {
  lastSpeed = speed;
  newSpeed = true;
}

static void bleTestCommandCallback(uint8_t cmd) {
  lastCommand = cmd;
  newCommand = true;
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

static bool showWizardPage(const char* text) {
  writeToOled(text);
  delay(20);
  
  while (true) {
    if (readButton(BLE_TEST_SW1_PIN)) {
      unsigned long holdStart = millis();
      if (checkHoldExit(BLE_TEST_SW1_PIN, holdStart)) {
        return false;
      }
      waitForButtonRelease(BLE_TEST_SW1_PIN);
      return true;
    }
    
    if (readButton(BLE_TEST_SW2_PIN)) {
      waitForButtonRelease(BLE_TEST_SW2_PIN);
      return false;
    }
    
    delay(10);
  }
}

void testBLERemote() {
  initOLED();
  
  pinMode(BLE_TEST_SW1_PIN, INPUT_PULLUP);
  pinMode(BLE_TEST_SW2_PIN, INPUT_PULLUP);
  
  setBLEDirectionCallback(bleTestDirectionCallback);
  setBLESpeedCallback(bleTestSpeedCallback);
  setBLECommandCallback(bleTestCommandCallback);
  
  if (!showWizardPage("BLE Test\n\nOpen LightBlue\napp on phone\n\nSW1:Next SW2:Skip\n(hold SW1=Exit)")) {
    clearOled(); return;
  }
  
  char connectBuffer[128];
  snprintf(connectBuffer, sizeof(connectBuffer), "LightBlue Setup\n\n1. Scan devices\n2. Find %s\n3. Tap Connect\n\nSW1:Next SW2:Skip", bleDeviceName ? bleDeviceName : "Device");
  if (!showWizardPage(connectBuffer)) {
    clearOled(); return;
  }
  
  if (!showWizardPage("LightBlue Setup\n\n4. Find service:\n   0x8001\n5. Tap to expand\n\nSW1:Next SW2:Skip")) {
    clearOled(); return;
  }
  
  if (!showWizardPage("LightBlue Setup\n\n6. Tap characteristic\n7. Write hex value\n   (no 0x, e.g. 7F)\n\nSW1:Next SW2:Skip")) {
    clearOled(); return;
  }
  
  writeToOled("Waiting for\nconnection...\n\nService: 0x8001\n\nSW2:Exit");
  
  unsigned long startTime = millis();
  while (!isBLEConnected() && millis() - startTime < 60000) {
    if (readButton(BLE_TEST_SW2_PIN)) { waitForButtonRelease(BLE_TEST_SW2_PIN); clearOled(); return; }
    delay(100);
  }
  
  if (!isBLEConnected()) {
    writeToOled("Connection\nTimeout!\n\nSW2:Exit");
    while (!readButton(BLE_TEST_SW2_PIN)) { delay(10); }
    waitForButtonRelease(BLE_TEST_SW2_PIN);
    clearOled();
    return;
  }
  
  if (!showWizardPage("Connected!\n\nNow test each\ncharacteristic\n\nSW1:Start SW2:Exit")) {
    clearOled(); return;
  }
  
  const char* testItems[] = {"Direction", "Speed", "Command"};
  int numItems = 3;
  int selectedIndex = 0;
  bool inTestMenu = true;
  unsigned long sw1HoldStart = 0;
  bool sw1WasPressed = false;
  
  while (inTestMenu) {
    char menuBuffer[128];
    snprintf(menuBuffer, sizeof(menuBuffer), "Test Menu\n> %s\n  %s\n\nSW1:Scroll SW2:Run\n(hold SW1=Exit)", 
             testItems[selectedIndex], testItems[(selectedIndex + 1) % numItems]);
    writeToOled(menuBuffer);
    
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
        writeToOled("Direction Test\n\nChar: 0x8002\nHex: 00-FF\n(80-FF=neg)\nSW2:Back");
        newDirection = false;
        while (!readButton(BLE_TEST_SW2_PIN)) {
          if (newDirection) {
            char buf[64];
            snprintf(buf, sizeof(buf), "Direction Test\n\nReceived:\n0x%02X (%d)\n\nSW2:Back", (uint8_t)lastDirection, lastDirection);
            writeToOled(buf);
            newDirection = false;
          }
          delay(50);
        }
        waitForButtonRelease(BLE_TEST_SW2_PIN);
      }
      else if (selectedIndex == 1) {
        writeToOled("Speed Test\n\nChar: 0x8003\nHex: 00 to FF\n\nSW2:Back");
        newSpeed = false;
        while (!readButton(BLE_TEST_SW2_PIN)) {
          if (newSpeed) {
            char buf[64];
            snprintf(buf, sizeof(buf), "Speed Test\n\nReceived:\n0x%02X (%d)\n\nSW2:Back", lastSpeed, lastSpeed);
            writeToOled(buf);
            newSpeed = false;
          }
          delay(50);
        }
        waitForButtonRelease(BLE_TEST_SW2_PIN);
      }
      else if (selectedIndex == 2) {
        writeToOled("Command Test\n\nChar: 0x8004\nHex: 00 to FF\n\nSW2:Back");
        newCommand = false;
        while (!readButton(BLE_TEST_SW2_PIN)) {
          if (newCommand) {
            char buf[64];
            snprintf(buf, sizeof(buf), "Command Test\n\nReceived:\n0x%02X (%d)\n\nSW2:Back", lastCommand, lastCommand);
            writeToOled(buf);
            newCommand = false;
          }
          delay(50);
        }
        waitForButtonRelease(BLE_TEST_SW2_PIN);
      }
    }
  }
  
  clearOled();
  writeToOled("BLE Test\nComplete!");
  delay(1500);
  clearOled();
}
