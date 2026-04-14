// Made for esp32-s3-devkitc1
#include "ble_client.h"
#include <NimBLEDevice.h>

static NimBLEClient* pClient = nullptr;
static NimBLERemoteService* pRemoteService = nullptr;
static NimBLERemoteCharacteristic* pCurrentCharacteristic = nullptr;
static bool bleClientInitialized = false;
static bool bleClientConnected = false;
static std::vector<String> scannedDevices;
static String lastNotifyValue;
static std::vector<uint8_t> lastNotifyBytes;
static BLENotifyCallback notifyCallback = nullptr;

class ClientCallbacks : public NimBLEClientCallbacks {
  void onConnect(NimBLEClient* pClient) {
    Serial.println("BLE Client: Connected to server");
    bleClientConnected = true;
  }
  
  void onDisconnect(NimBLEClient* pClient, int reason) {
    Serial.println("BLE Client: Disconnected from server");
    bleClientConnected = false;
    pRemoteService = nullptr;
    pCurrentCharacteristic = nullptr;
  }
};

class NotifyCallbackHandler : public NimBLERemoteCharacteristicCallbacks {
  void onNotify(NimBLERemoteCharacteristic* pCharacteristic, uint8_t* pData, size_t length, bool isNotify) {
    lastNotifyValue = String((char*)pData, length);
    lastNotifyBytes.clear();
    for (size_t i = 0; i < length; i++) {
      lastNotifyBytes.push_back(pData[i]);
    }
    if (notifyCallback) {
      notifyCallback(lastNotifyValue.c_str());
    }
  }
};

static ClientCallbacks clientCallbacks;
static NotifyCallbackHandler notifyHandler;

void initBLEClient() {
  NimBLEDevice::init("BLEClient");
  NimBLEDevice::setSecurityAuth(false, false, false);
  bleClientInitialized = true;
  Serial.println("BLE Client initialized");
}

std::vector<String> scanBLEDevices(int durationMs) {
  scannedDevices.clear();
  
  if (!bleClientInitialized) {
    initBLEClient();
  }
  
  NimBLEScan* pScan = NimBLEDevice::getScan();
  pScan->setActiveScan(true);
  pScan->setInterval(100);
  pScan->setWindow(99);
  
  Serial.println("Scanning for BLE devices...");
  NimBLEScanResults results = pScan->start(durationMs / 1000, false);
  
  for (int i = 0; i < results.getCount(); i++) {
    NimBLEAdvertisedDevice device = results.getDevice(i);
    String deviceName = device.getName().c_str();
    if (deviceName.length() > 0) {
      scannedDevices.push_back(deviceName);
      Serial.printf("Found device: %s\n", deviceName.c_str());
    }
  }
  
  pScan->stop();
  Serial.printf("Scan complete. Found %d named devices.\n", scannedDevices.size());
  
  return scannedDevices;
}

bool connectBLEDevice(const String& deviceName) {
  if (!bleClientInitialized) {
    initBLEClient();
  }
  
  if (bleClientConnected) {
    disconnectBLEDevice();
  }
  
  Serial.printf("Searching for device: %s\n", deviceName.c_str());
  
  NimBLEScan* pScan = NimBLEDevice::getScan();
  pScan->setActiveScan(true);
  NimBLEScanResults results = pScan->start(5, false);
  
  NimBLEAdvertisedDevice targetDevice;
  bool found = false;
  
  for (int i = 0; i < results.getCount(); i++) {
    NimBLEAdvertisedDevice device = results.getDevice(i);
    if (device.getName() == deviceName.c_str()) {
      targetDevice = device;
      found = true;
      break;
    }
  }
  
  pScan->stop();
  
  if (!found) {
    Serial.println("Device not found");
    return false;
  }
  
  pClient = NimBLEDevice::createClient();
  pClient->setClientCallbacks(&clientCallbacks, false);
  
  Serial.println("Connecting to device...");
  if (!pClient->connect(&targetDevice)) {
    Serial.println("Failed to connect");
    NimBLEDevice::deleteClient(pClient);
    pClient = nullptr;
    return false;
  }
  
  Serial.println("Connected! Discovering services...");
  
  std::vector<NimBLERemoteService*>* services = pClient->getServices();
  if (services && services->size() > 0) {
    pRemoteService = services->front();
    Serial.printf("Found %d services\n", services->size());
  }
  
  return true;
}

void disconnectBLEDevice() {
  if (pClient && bleClientConnected) {
    pClient->disconnect();
    NimBLEDevice::deleteClient(pClient);
    pClient = nullptr;
    pRemoteService = nullptr;
    pCurrentCharacteristic = nullptr;
    bleClientConnected = false;
    Serial.println("Disconnected from BLE device");
  }
}

bool isBLEClientConnected() {
  return bleClientConnected && pClient && pClient->isConnected();
}

static NimBLERemoteCharacteristic* findCharacteristic(const String& uuid) {
  if (!pClient || !pClient->isConnected()) {
    Serial.println("Not connected to any device");
    return nullptr;
  }
  
  NimBLEUUID charUuid(uuid.c_str());
  
  std::vector<NimBLERemoteService*>* services = pClient->getServices();
  if (!services) return nullptr;
  
  for (auto service : *services) {
    std::vector<NimBLERemoteCharacteristic*>* characteristics = service->getCharacteristics();
    if (!characteristics) continue;
    
    for (auto characteristic : *characteristics) {
      if (characteristic->getUUID() == charUuid) {
        return characteristic;
      }
    }
  }
  
  Serial.printf("Characteristic %s not found\n", uuid.c_str());
  return nullptr;
}

bool writeBLEString(const String& uuid, const String& value) {
  NimBLERemoteCharacteristic* pChar = findCharacteristic(uuid);
  if (!pChar) return false;
  
  bool success = pChar->writeValue(value.c_str(), false);
  if (success) {
    Serial.printf("Wrote string to %s: %s\n", uuid.c_str(), value.c_str());
  }
  return success;
}

bool writeBLEBytes(const String& uuid, const std::vector<uint8_t>& value) {
  NimBLERemoteCharacteristic* pChar = findCharacteristic(uuid);
  if (!pChar) return false;
  
  bool success = pChar->writeValue((uint8_t*)value.data(), value.size(), false);
  if (success) {
    Serial.printf("Wrote %d bytes to %s\n", value.size(), uuid.c_str());
  }
  return success;
}

String readBLEString(const String& uuid) {
  NimBLERemoteCharacteristic* pChar = findCharacteristic(uuid);
  if (!pChar) return "";
  
  NimBLEAttValue value = pChar->readValue();
  String result = String((char*)value.data(), value.size());
  Serial.printf("Read string from %s: %s\n", uuid.c_str(), result.c_str());
  return result;
}

std::vector<uint8_t> readBLEBytes(const String& uuid) {
  std::vector<uint8_t> result;
  
  NimBLERemoteCharacteristic* pChar = findCharacteristic(uuid);
  if (!pChar) return result;
  
  NimBLEAttValue value = pChar->readValue();
  for (size_t i = 0; i < value.size(); i++) {
    result.push_back(value[i]);
  }
  
  Serial.printf("Read %d bytes from %s\n", result.size(), uuid.c_str());
  return result;
}

void subscribeBLENotify(const String& uuid, BLENotifyCallback callback) {
  NimBLERemoteCharacteristic* pChar = findCharacteristic(uuid);
  if (!pChar) return;
  
  notifyCallback = callback;
  pChar->subscribe(true, &notifyHandler, true);
  Serial.printf("Subscribed to notifications on %s\n", uuid.c_str());
}

String getBLENotifyValue() {
  return lastNotifyValue;
}

std::vector<uint8_t> getBLENotifyBytes() {
  return lastNotifyBytes;
}

void testBLEClient() {
  Serial.println("\n=== BLE Client Test ===\n");
  
  if (!bleClientInitialized) {
    initBLEClient();
  }
  
  Serial.println("Scanning for BLE devices (10 seconds)...\n");
  std::vector<String> devices = scanBLEDevices(10000);
  
  if (devices.empty()) {
    Serial.println("No BLE devices found with names.");
    Serial.println("\nMake sure the target device is powered on and advertising.");
  } else {
    Serial.println("\nFound devices:");
    for (size_t i = 0; i < devices.size(); i++) {
      Serial.printf("  %d: %s\n", i + 1, devices[i].c_str());
    }
  }
  
  Serial.println("\n=== BLE Client Test Complete ===\n");
}
