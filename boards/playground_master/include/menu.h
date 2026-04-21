// Made for playground_master
#ifndef MENU_H
#define MENU_H

#include <Arduino.h>
#include <vector>

// Show a scrollable menu on OLED display
// Returns the selected item as String
// yPin: analog pin for Y-axis (joystick up/down)
// buttonPin: digital pin for button (select)
String showMenu(const std::vector<String>& items, const String& title, int yPin, int buttonPin);

#endif // MENU_H
