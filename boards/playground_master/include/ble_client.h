// Made for playground_master
#ifndef BLE_CLIENT_H
#define BLE_CLIENT_H

#include <Arduino.h>
#include <string>
#include <vector>
#include <functional>

typedef void (*BLENotifyCallback)(const std::string& value);

void initBLEClient();
std::vector<String> scanBLEDevices(int durationMs);
bool connectBLEDevice(const String& deviceName);
void disconnectBLEDevice();
bool isBLEClientConnected();
bool writeBLEString(const String& uuid, const String& value);
bool writeBLEBytes(const String& uuid, const std::vector<uint8_t>& value);
String readBLEString(const String& uuid);
std::vector<uint8_t> readBLEBytes(const String& uuid);
void subscribeBLENotify(const String& uuid, BLENotifyCallback callback);
String getBLENotifyValue();
std::vector<uint8_t> getBLENotifyBytes();
void testBLEClient();

#endif // BLE_CLIENT_H
