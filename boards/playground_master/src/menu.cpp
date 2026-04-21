// Made for playground_master
#include "menu.h"
#include "oled.h"
#include <U8g2lib.h>

extern U8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2;

String showMenu(const std::vector<String>& items, const String& title, int yPin, int buttonPin) {
  if (items.empty()) {
    return "";
  }
  
  // Initialize pins
  pinMode(yPin, INPUT);
  pinMode(buttonPin, INPUT_PULLUP);
  
  int selectedIndex = 0;
  int lastYValue = analogRead(yPin);
  unsigned long lastDebounceTime = 0;
  const unsigned long debounceDelay = 200;  // ms between scrolls
  const int scrollThreshold = 500;  // Threshold for detecting scroll
  
  while (true) {
    // Read Y-axis (joystick up/down)
    int yValue = analogRead(yPin);
    
    // Check for scroll up (Y value > center + threshold)
    if (yValue > lastYValue + scrollThreshold && millis() - lastDebounceTime > debounceDelay) {
      selectedIndex = (selectedIndex + 1) % items.size();
      lastDebounceTime = millis();
    }
    // Check for scroll down (Y value < center - threshold)
    else if (yValue < lastYValue - scrollThreshold && millis() - lastDebounceTime > debounceDelay) {
      selectedIndex = (selectedIndex - 1 + items.size()) % items.size();
      lastDebounceTime = millis();
    }
    
    lastYValue = yValue;
    
    // Check for button press (select)
    if (digitalRead(buttonPin) == LOW) {
      delay(50);  // Simple debounce
      if (digitalRead(buttonPin) == LOW) {
        // Wait for button release
        while (digitalRead(buttonPin) == LOW) {
          delay(10);
        }
        return items[selectedIndex];
      }
    }
    
    // Display menu on OLED
    u8g2.clearBuffer();
    u8g2.setFont(u8g2_font_ncenB08_tr);
    
    // Draw title
    u8g2.setCursor(0, 12);
    u8g2.print(title.c_str());
    
    // Draw items (show 3 items at a time)
    int startIdx = selectedIndex - 1;
    if (startIdx < 0) startIdx = 0;
    if (items.size() - startIdx < 3 && items.size() > 3) {
      startIdx = items.size() - 3;
    }
    
    for (int i = 0; i < 3 && (startIdx + i) < (int)items.size(); i++) {
      int itemIdx = startIdx + i;
      int yPos = 28 + i * 16;
      
      // Draw selection marker
      if (itemIdx == selectedIndex) {
        u8g2.drawStr(0, yPos, ">");
      }
      
      // Draw item text (truncated if too long)
      String itemText = items[itemIdx];
      if (itemText.length() > 12) {
        itemText = itemText.substring(0, 11) + "..";
      }
      u8g2.setCursor(12, yPos);
      u8g2.print(itemText.c_str());
    }
    
    // Draw scroll indicator if more items
    if (items.size() > 3) {
      u8g2.setCursor(120, 28);
      u8g2.print(selectedIndex + 1);
      u8g2.print("/");
      u8g2.print(items.size());
    }
    
    u8g2.sendBuffer();
    
    delay(50);  // Small delay to prevent flickering
  }
}
