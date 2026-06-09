// Made for playground_controller
#include "oled.h"
#include <time.h>
#include <stdarg.h>

// 0.42" OLED 72x40 SSD1306 on I2C GPIO5/6
U8G2_SSD1306_72X40_ER_F_HW_I2C u8g2(U8G2_R0, U8X8_PIN_NONE, OLED_SCL_PIN, OLED_SDA_PIN);

void initOLED(const u8g2_cb_t* rotation) {
  u8g2.begin();
  u8g2.setDisplayRotation(rotation);
  u8g2.enableUTF8Print();
  u8g2.setFont(u8g2_font_ncenB08_tr);
  u8g2.setContrast(255);
  u8g2.setBusClock(400000);
  clearOled();
}

static void writeToOledInternal(const char* text) {
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

void writeToOled(const char* format, ...) {
  char buf[256];
  va_list args;
  va_start(args, format);
  vsnprintf(buf, sizeof(buf), format, args);
  va_end(args);
  writeToOledInternal(buf);
}

void writeToOled(const String& str) {
  writeToOledInternal(str.c_str());
}

void writeToOled(int value) {
  char buf[256];
  snprintf(buf, sizeof(buf), "%d", value);
  writeToOledInternal(buf);
}

void clearOled() {
  u8g2.clearBuffer();
  u8g2.sendBuffer();
}

void testOLED() {
  for (int i = 5; i >= 0; i--) {
    u8g2.clearBuffer();
    u8g2.setFont(u8g2_font_ncenB08_tr);

    u8g2.setCursor(0, 10);
    u8g2.print("OLED Test");

    u8g2.setCursor(0, 20);
    u8g2.print("72x40");

    u8g2.setCursor(0, 30);
    u8g2.print("Count: ");
    u8g2.print(i);

    u8g2.sendBuffer();
    delay(1000);
  }
  clearOled();
}
