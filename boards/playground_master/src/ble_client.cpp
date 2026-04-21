// Made for playground_master
#include "ble_client.h"
#include <NimBLEDevice.h>
#include "oled.h"

static NimBLEClient* pClient = nullptr;
static NimBLERemoteService* pRemoteService = nullptr;
static NimBLERemoteCharacteristic* pCurrentCharacteristic = nullptr;
static bool bleClientInitialized = false;
static bool bleClientConnected = false;
static std::vector<String> scannedDevices;
static std::vector<NimBLEAddress> scannedAddresses;
static String lastNotifyValue;
static std::vector<uint8_t> lastNotifyBytes;
static BLENotifyCallback notifyCallback = nullptr;

class ScanCallbacks : public NimBLEScanCallbacks {
  void onResult(const NimBLEAdvertisedDevice* device) {
    String name = device->getName().c_str();
    NimBLEAddress addr = device->getAddress();
    
    for (size_t i = 0; i < scannedAddresses.size(); i++) {
      if (scannedAddresses[i] == addr) return;
    }
    
    scannedAddresses.push_back(addr);
    if (name.length() > 0) {
      scannedDevices.push_back(name);
    } else {
      scannedDevices.push_back(String(addr.toString().c_str()));
    }
  }
};

static ScanCallbacks scanCallbacks;

class ClientCallbacks : public NimBLEClientCallbacks {
  void onConnect(NimBLEClient* pClient) {
    bleClientConnected = true;
  }
  
  void onDisconnect(NimBLEClient* pClient, int reason) {
    bleClientConnected = false;
    pRemoteService = nullptr;
    pCurrentCharacteristic = nullptr;
  }
};

static ClientCallbacks clientCallbacks;

void initBLEClient() {
  clearOled();
  writeToOled("BLE init...");
  delay(1000);
  
  NimBLEDevice::init("");
  NimBLEDevice::setSecurityAuth(false, false, false);
  
  NimBLEScan* pScan = NimBLEDevice::getScan();
  pScan->setScanCallbacks(&scanCallbacks, false);
  pScan->setActiveScan(false);
  
  bleClientInitialized = true;
  clearOled();
  writeToOled("BLE ready");
  delay(1000);
}

std::vector<String> scanBLEDevices(int durationMs) {
  scannedDevices.clear();
  scannedAddresses.clear();
  
  NimBLEScan* pScan = NimBLEDevice::getScan();
  pScan->clearResults();
  
  clearOled();
  writeToOled("Scanning %ds", durationMs / 1000);
  
  pScan->start(durationMs, false);
  
  unsigned long startTime = millis();
  while (millis() - startTime < (unsigned long)durationMs) {
    clearOled();
    writeToOled("Scan...\n%d found", scannedDevices.size());
    delay(500);
  }
  
  pScan->stop();
  
  std::vector<String> namedDevices;
  std::vector<NimBLEAddress> namedAddresses;
  for (size_t i = 0; i < scannedDevices.size(); i++) {
    if (scannedDevices[i].indexOf(':') == -1) {
      namedDevices.push_back(scannedDevices[i]);
      namedAddresses.push_back(scannedAddresses[i]);
    }
  }
  
  scannedDevices = namedDevices;
  scannedAddresses = namedAddresses;
  
  clearOled();
  writeToOled("Named: %d", scannedDevices.size());
  delay(1000);
  
  return scannedDevices;
}

bool connectBLEDevice(const String& deviceName) {
  if (!bleClientInitialized) {
    initBLEClient();
  }
  
  if (bleClientConnected) {
    disconnectBLEDevice();
  }
  
  NimBLEAddress targetAddress;
  bool found = false;
  for (size_t i = 0; i < scannedDevices.size(); i++) {
    if (scannedDevices[i] == deviceName) {
      targetAddress = scannedAddresses[i];
      found = true;
      break;
    }
  }
  
  if (!found) {
    clearOled();
    writeToOled("Not found!");
    delay(2000);
    return false;
  }
  
  clearOled();
  writeToOled("Connecting...");
  
  pClient = NimBLEDevice::createClient();
  pClient->setClientCallbacks(&clientCallbacks, false);
  
  if (!pClient->connect(targetAddress)) {
    NimBLEDevice::deleteClient(pClient);
    pClient = nullptr;
    clearOled();
    writeToOled("Connect failed!");
    delay(2000);
    return false;
  }
  
  clearOled();
  writeToOled("Discovering...");
  
  if (!pClient->discoverAttributes()) {
    pClient->disconnect();
    NimBLEDevice::deleteClient(pClient);
    pClient = nullptr;
    clearOled();
    writeToOled("Discovery failed!");
    delay(2000);
    return false;
  }
  
  const std::vector<NimBLERemoteService*>& services = pClient->getServices();
  if (services.size() > 0) {
    pRemoteService = services.front();
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
  }
}

bool isBLEClientConnected() {
  return bleClientConnected && pClient && pClient->isConnected();
}

static NimBLERemoteCharacteristic* findCharacteristic(const String& uuid) {
  if (!pClient || !pClient->isConnected()) {
    return nullptr;
  }
  
  NimBLEUUID charUuid(uuid.c_str());
  
  const std::vector<NimBLERemoteService*>& services = pClient->getServices();
  
  for (auto service : services) {
    const std::vector<NimBLERemoteCharacteristic*>& characteristics = service->getCharacteristics();
    
    for (auto characteristic : characteristics) {
      if (characteristic->getUUID() == charUuid) {
        return characteristic;
      }
    }
  }
  
  return nullptr;
}

bool writeBLEString(const String& uuid, const String& value) {
  NimBLERemoteCharacteristic* pChar = findCharacteristic(uuid);
  if (!pChar) return false;
  return pChar->writeValue(value.c_str(), false);
}

bool writeBLEBytes(const String& uuid, const std::vector<uint8_t>& value) {
  NimBLERemoteCharacteristic* pChar = findCharacteristic(uuid);
  if (!pChar) return false;
  return pChar->writeValue((uint8_t*)value.data(), value.size(), false);
}

String readBLEString(const String& uuid) {
  NimBLERemoteCharacteristic* pChar = findCharacteristic(uuid);
  if (!pChar) return "";
  NimBLEAttValue value = pChar->readValue();
  return String((char*)value.data(), value.size());
}

std::vector<uint8_t> readBLEBytes(const String& uuid) {
  std::vector<uint8_t> result;
  NimBLERemoteCharacteristic* pChar = findCharacteristic(uuid);
  if (!pChar) return result;
  NimBLEAttValue value = pChar->readValue();
  for (size_t i = 0; i < value.size(); i++) {
    result.push_back(value[i]);
  }
  return result;
}

void subscribeBLENotify(const String& uuid, BLENotifyCallback callback) {
  NimBLERemoteCharacteristic* pChar = findCharacteristic(uuid);
  if (!pChar) return;
  notifyCallback = callback;
  pChar->subscribe(true, [pChar](NimBLERemoteCharacteristic* pChr, uint8_t* pData, size_t length, bool isNotify) {
    lastNotifyValue = String((char*)pData, length);
    lastNotifyBytes.clear();
    for (size_t i = 0; i < length; i++) {
      lastNotifyBytes.push_back(pData[i]);
    }
    if (notifyCallback) {
      notifyCallback(lastNotifyValue.c_str());
    }
  }, true);
}

String getBLENotifyValue() {
  return lastNotifyValue;
}

std::vector<uint8_t> getBLENotifyBytes() {
  return lastNotifyBytes;
}

void testBLEClient() {
  if (!bleClientInitialized) {
    initBLEClient();
  }
  scanBLEDevices(10000);
}
