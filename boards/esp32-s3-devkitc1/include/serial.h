#ifndef SERIAL_H
#define SERIAL_H

#include <Arduino.h>

void initSerial(unsigned long baud);
void serialPrint(const char* text);
void serialPrint(int value);
void serialPrint(float value);
void serialPrintln(const char* text);
void serialPrintln(int value);
void serialPrintln(float value);
String serialReadChar(bool blocking);
String serialReadLine();
int serialAvailable();

#endif
