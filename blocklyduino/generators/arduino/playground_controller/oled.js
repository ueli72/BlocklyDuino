/**
 * Visual Blocks Language
 *
 * Copyright 2024
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating Arduino for OLED display blocks.
 * ESP32-C3 0.42 OLED - 72x40 pixels, I2C on GPIO5/6.
 */
'use strict';

Blockly.Arduino.oled_init = function() {
  Blockly.Arduino.definitions_['include_u8g2'] = '#include <U8g2lib.h>\n';
  Blockly.Arduino.definitions_['include_wire'] = '#include <Wire.h>\n';
  Blockly.Arduino.definitions_['oled_obj'] = 'U8G2_SSD1306_72X40_ER_F_HW_I2C u8g2(U8G2_R0, U8X8_PIN_NONE, 6, 5);\n';
  Blockly.Arduino.definitions_['oled_width'] = '#define OLED_WIDTH 72\n';
  Blockly.Arduino.definitions_['oled_height'] = '#define OLED_HEIGHT 40\n';
  
  var code = 'u8g2.begin();\n';
  code += 'u8g2.setContrast(255);\n';
  code += 'u8g2.setBusClock(400000);\n';
  code += 'u8g2.setFont(u8g2_font_ncenB08_tr);\n';
  return code;
};

Blockly.Arduino.oled_write = function() {
  var text = Blockly.Arduino.valueToCode(this, 'TEXT', Blockly.Arduino.ORDER_ATOMIC) || '""';
  
  Blockly.Arduino.definitions_['include_u8g2'] = '#include <U8g2lib.h>\n';
  Blockly.Arduino.definitions_['include_wire'] = '#include <Wire.h>\n';
  Blockly.Arduino.definitions_['oled_obj'] = 'U8G2_SSD1306_72X40_ER_F_HW_I2C u8g2(U8G2_R0, U8X8_PIN_NONE, 6, 5);\n';
  
  var code = 'u8g2.clearBuffer();\n';
  code += 'u8g2.print(' + text + ');\n';
  code += 'u8g2.sendBuffer();\n';
  return code;
};

Blockly.Arduino.oled_clear = function() {
  Blockly.Arduino.definitions_['include_u8g2'] = '#include <U8g2lib.h>\n';
  Blockly.Arduino.definitions_['include_wire'] = '#include <Wire.h>\n';
  Blockly.Arduino.definitions_['oled_obj'] = 'U8G2_SSD1306_72X40_ER_F_HW_I2C u8g2(U8G2_R0, U8X8_PIN_NONE, 6, 5);\n';
  
  var code = 'u8g2.clearBuffer();\n';
  code += 'u8g2.sendBuffer();\n';
  return code;
};

Blockly.Arduino.oled_set_cursor = function() {
  var x = Blockly.Arduino.valueToCode(this, 'X', Blockly.Arduino.ORDER_ATOMIC) || '0';
  var y = Blockly.Arduino.valueToCode(this, 'Y', Blockly.Arduino.ORDER_ATOMIC) || '0';
  
  Blockly.Arduino.definitions_['include_u8g2'] = '#include <U8g2lib.h>\n';
  Blockly.Arduino.definitions_['include_wire'] = '#include <Wire.h>\n';
  Blockly.Arduino.definitions_['oled_obj'] = 'U8G2_SSD1306_72X40_ER_F_HW_I2C u8g2(U8G2_R0, U8X8_PIN_NONE, 6, 5);\n';
  
  var code = 'u8g2.setCursor(' + x + ', ' + y + ');\n';
  return code;
};

Blockly.Arduino.oled_test = function() {
  Blockly.Arduino.definitions_['include_oled_h'] = '#include "oled.h"\n';
  
  var code = 'testOLED();\n';
  return code;
};
