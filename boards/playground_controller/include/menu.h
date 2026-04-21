// Made for playground_controller
#ifndef MENU_H
#define MENU_H

#include <Arduino.h>
#include <vector>

// Show a scrollable menu on OLED display using built-in joysticks
// Returns the selected item as String
// useLeftJoystick: true for JoyLeft, false for JoyRight
String showMenu(const std::vector<String>& items, const String& title, bool useLeftJoystick);

#endif // MENU_H
