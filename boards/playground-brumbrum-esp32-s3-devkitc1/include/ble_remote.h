#ifndef BLE_REMOTE_H
#define BLE_REMOTE_H

#include <Arduino.h>

typedef void (*BLEDirectionCallback)(int8_t direction);
typedef void (*BLESpeedCallback)(uint8_t speed);
typedef void (*BLECommandCallback)(uint8_t command);

void initBLERemote(const char* deviceName);
void setBLEDirectionCallback(BLEDirectionCallback callback);
void setBLESpeedCallback(BLESpeedCallback callback);
void setBLECommandCallback(BLECommandCallback callback);
void sendBLEData(const char* data);
bool isBLEConnected();
void testBLERemote();

#endif // BLE_REMOTE_H
