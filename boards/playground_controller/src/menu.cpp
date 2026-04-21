// Made for playground_controller
#include "menu.h"
#include "oled.h"
#include "ky023.h"
#include <U8g2lib.h>

extern U8G2_SSD1306_72X40_ER_F_HW_I2C u8g2;

String showMenu(const std::vector<String>& items, const String& title, bool useLeftJoystick) {
  if (items.empty()) {
    clearOled();
    writeToOled("No devices");
    delay(1000);
    return "";
  }
  
  if (useLeftJoystick) {
    initJoyLeft();
  } else {
    initJoyRight();
  }
  
  int selectedIndex = 0;
  int lastYValue = useLeftJoystick ? readJoyLeftY() : readJoyRightY();
  unsigned long lastDebounceTime = 0;
  const unsigned long debounceDelay = 200;
  const int scrollThreshold = 500;
  
  while (true) {
    int yValue = useLeftJoystick ? readJoyLeftY() : readJoyRightY();
    
    if (yValue > lastYValue + scrollThreshold && millis() - lastDebounceTime > debounceDelay) {
      selectedIndex = (selectedIndex + 1) % items.size();
      lastDebounceTime = millis();
    }
    else if (yValue < lastYValue - scrollThreshold && millis() - lastDebounceTime > debounceDelay) {
      selectedIndex = (selectedIndex - 1 + items.size()) % items.size();
      lastDebounceTime = millis();
    }
    
    lastYValue = yValue;
    
    bool buttonPressed = useLeftJoystick ? isJoyLeftPressed() : isJoyRightPressed();
    if (buttonPressed) {
      delay(50);
      buttonPressed = useLeftJoystick ? isJoyLeftPressed() : isJoyRightPressed();
      if (buttonPressed) {
        while ((useLeftJoystick ? isJoyLeftPressed() : isJoyRightPressed())) {
          delay(10);
        }
        return items[selectedIndex];
      }
    }
    
    u8g2.clearBuffer();
    u8g2.setFont(u8g2_font_ncenB08_tr);
    
    u8g2.setCursor(0, 10);
    u8g2.print(title.c_str());
    
    int startIdx = selectedIndex - 1;
    if (startIdx < 0) startIdx = 0;
    if (items.size() - startIdx < 2 && items.size() > 2) {
      startIdx = items.size() - 2;
    }
    
    for (int i = 0; i < 2 && (startIdx + i) < (int)items.size(); i++) {
      int itemIdx = startIdx + i;
      int yPos = 22 + i * 14;
      
      if (itemIdx == selectedIndex) {
        u8g2.drawStr(0, yPos, ">");
      }
      
      String itemText = items[itemIdx];
      if (itemText.length() > 9) {
        itemText = itemText.substring(0, 8) + "..";
      }
      u8g2.setCursor(10, yPos);
      u8g2.print(itemText.c_str());
    }
    
    if (items.size() > 2) {
      u8g2.setCursor(60, 36);
      u8g2.print(selectedIndex + 1);
      u8g2.print("/");
      u8g2.print(items.size());
    }
    
    u8g2.sendBuffer();
    
    delay(50);
  }
}
