#include "ble_remote.h"
#include <NimBLEDevice.h>

#define SERVICE_UUID           "4fafc201-1fb5-459e-8fcc-c5e9f8f1c9ab"
#define CHARACTERISTIC_DIRECTION "beb5483e-36e1-4688-b7f5-ea07361b26a8"
#define CHARACTERISTIC_SPEED     "beb5483e-36e1-4688-b7f5-ea07361b26a9"
#define CHARACTERISTIC_COMMAND    "beb5483e-36e1-4688-b7f5-ea07361b26aa"
#define CHARACTERISTIC_SENSOR     "beb5483e-36e1-4688-b7f5-ea07361b26ab"

static NimBLEServer* pServer = nullptr;
static NimBLECharacteristic* pDirectionCharacteristic = nullptr;
static NimBLECharacteristic* pSpeedCharacteristic = nullptr;
static NimBLECharacteristic* pCommandCharacteristic = nullptr;
static NimBLECharacteristic* pSensorCharacteristic = nullptr;

static BLEDirectionCallback directionCallback = nullptr;
static BLESpeedCallback speedCallback = nullptr;
static BLECommandCallback commandCallback = nullptr;

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
      std::string value = pCharacteristic->getValue();
      commandCallback(value.c_str());
    }
  }
};

static DirectionCallbackHandler directionHandler;
static SpeedCallbackHandler speedHandler;
static CommandCallbackHandler commandHandler;

void initBLERemote(const char* deviceName) {
  NimBLEDevice::init(deviceName);
  
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
    NIMBLE_PROPERTY::WRITE
  );
  pCommandCharacteristic->setCallbacks(&commandHandler);
  
  pSensorCharacteristic = pService->createCharacteristic(
    CHARACTERISTIC_SENSOR,
    NIMBLE_PROPERTY::NOTIFY
  );
  
  pService->start();
  
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

void testBLERemote() {
  Serial.println("\n=== BLE Remote Test ===");
  Serial.println("Connect with nRF Connect or similar BLE app");
  Serial.println("Service UUID: " SERVICE_UUID);
  Serial.println("Direction UUID: " CHARACTERISTIC_DIRECTION);
  Serial.println("Speed UUID: " CHARACTERISTIC_SPEED);
  Serial.println("Command UUID: " CHARACTERISTIC_COMMAND);
  Serial.println("Sensor UUID: " CHARACTERISTIC_SENSOR);
  Serial.println("\nWaiting for commands...");
  
  unsigned long startTime = millis();
  while (millis() - startTime < 30000) {
    if (isBLEConnected()) {
      Serial.println("Client connected!");
    }
    delay(1000);
  }
  
  Serial.println("BLE test complete.");
}
