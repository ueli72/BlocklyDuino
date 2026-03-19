#include "oled.h"

// Create OLED object with software I2C on pins 9 (SCL) and 8 (SDA)
U8G2_SSD1306_128X64_NONAME_F_SW_I2C u8g2(U8G2_R0, OLED_SCL_PIN, OLED_SDA_PIN, U8X8_PIN_NONE);

// Initialize OLED display
void initOLED() {
  u8g2.begin();
  u8g2.enableUTF8Print();

  // Choose a smaller font so we can fit more lines on our 128x64 display.
  // The previous ncenB08_tr font only allowed about five lines; switching to
  // 5x8 or 6x10 will give us ~10 lines of text.
  u8g2.setFont(u8g2_font_5x8_tr);

  clearOled();
  Serial.println("OLED initialized successfully");
}

// Write text to OLED display (handles '\n' line breaks)
void writeToOled(const char* text) {
  u8g2.clearBuffer();                   // Clear the buffer
  u8g2.setFont(u8g2_font_ncenB08_tr);   // ensure font is set (initOLED calls this too)

  // copy input because strtok modifies string
  char buf[256];
  strncpy(buf, text, sizeof(buf));
  buf[sizeof(buf) - 1] = '\0';

  int y = u8g2.getMaxCharHeight();     // start at one line height from top
  const char* sep = "\n";
  char* line = strtok(buf, sep);
  while (line != NULL) {
    u8g2.setCursor(0, y);
    u8g2.print(line);
    y += u8g2.getMaxCharHeight() + 1;   // advance by font height + 1px gap
    line = strtok(NULL, sep);
  }

  u8g2.sendBuffer();                    // Send buffer to display

  Serial.print("OLED output: ");
  Serial.println(text);
}

// Clear the OLED display
void clearOled() {
  u8g2.clearBuffer();
  u8g2.sendBuffer();
}

// Test function for OLED
void testOLED() {
  Serial.println("Starting OLED test...");
  
  initOLED();
  delay(500);
  
  // Display "OLED Test"
  writeToOled("OLED Test");
  
  Serial.println("OLED test completed");
}
