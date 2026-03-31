#ifndef KY023_H
#define KY023_H

#include <Arduino.h>

void initKY023(int xPin, int yPin, int buttonPin);
int readKY023X();
int readKY023Y();
bool isKY023ButtonPressed();
void testKY023();

#endif
