#include "oled.h"
#include <time.h>

U8G2_SSD1306_128X64_NONAME_F_SW_I2C u8g2(U8G2_R0, OLED_SCL_PIN, OLED_SDA_PIN, U8X8_PIN_NONE);

void initOLED() {
  u8g2.begin();
  u8g2.enableUTF8Print();
  u8g2.setFont(u8g2_font_5x8_tr);
  clearOled();
}

void writeToOled(const char* text) {
  u8g2.clearBuffer();
  u8g2.setFont(u8g2_font_ncenB08_tr);

  char buf[256];
  strncpy(buf, text, sizeof(buf));
  buf[sizeof(buf) - 1] = '\0';

  int y = u8g2.getMaxCharHeight();
  const char* sep = "\n";
  char* line = strtok(buf, sep);
  while (line != NULL) {
    u8g2.setCursor(0, y);
    u8g2.print(line);
    y += u8g2.getMaxCharHeight() + 1;
    line = strtok(NULL, sep);
  }

  u8g2.sendBuffer();
}

void clearOled() {
  u8g2.clearBuffer();
  u8g2.sendBuffer();
}

void testOLED() {
  for (int i = 5; i >= 0; i--) {
    u8g2.clearBuffer();
    u8g2.setFont(u8g2_font_ncenB08_tr);

    u8g2.setCursor(0, 12);
    u8g2.print("OLED Test");

    u8g2.setCursor(0, 26);
    u8g2.print("Version: ");
    u8g2.print(__DATE__);

    u8g2.setCursor(0, 40);
    u8g2.print("Countdown: ");
    u8g2.print(i);

    u8g2.sendBuffer();
    delay(1000);
  }
  clearOled();
}