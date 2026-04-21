// Made for playground_master
#include "serial.h"
#include <vector>

void initSerial(unsigned long baud) {
    Serial.begin(baud);
}

void serialPrint(const char* text) {
    Serial.print(text);
}

void serialPrint(int value) {
    Serial.print(value);
}

void serialPrint(float value) {
    Serial.print(value);
}

void serialPrintln(const char* text) {
    Serial.println(text);
}

void serialPrintln(int value) {
    Serial.println(value);
}

void serialPrintln(float value) {
    Serial.println(value);
}

void serialPrintArray(const std::vector<String>& arr) {
    Serial.printf("Array[%d]:\n", arr.size());
    for (size_t i = 0; i < arr.size(); i++) {
        Serial.printf("  [%d] %s\n", i, arr[i].c_str());
    }
}

String serialReadChar(bool blocking) {
    if (blocking) {
        while (!Serial.available()) {
            delay(10);
        }
        char c = (char)Serial.read();
        return String(c);
    } else {
        if (Serial.available()) {
            char c = (char)Serial.read();
            return String(c);
        }
        return String("");
    }
}

String serialReadLine() {
    String line = "";
    
    while (true) {
        if (Serial.available()) {
            char c = (char)Serial.read();
            
            if (c == '\r' || c == '\n') {
                if (line.length() > 0) {
                    break;
                }
            } else {
                line += c;
            }
        }
        delay(10);
    }
    
    line.trim();
    return line;
}

int serialAvailable() {
    return Serial.available();
}
