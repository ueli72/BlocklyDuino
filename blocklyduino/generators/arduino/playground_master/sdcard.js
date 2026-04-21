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
 * @fileoverview Generating Arduino for SD Card blocks.
 */
'use strict';

Blockly.Arduino.sdcard_init = function() {
  Blockly.Arduino.definitions_['include_sdcard_h'] = '#include "sdcard.h"\n';
  var code = 'initSDCard();  // Initialize SD card module\n';
  return code;
};

Blockly.Arduino.sdcard_write = function() {
  Blockly.Arduino.definitions_['include_sdcard_h'] = '#include "sdcard.h"\n';
  var path = Blockly.Arduino.valueToCode(this, 'PATH', Blockly.Arduino.ORDER_ATOMIC) || '"/default.txt"';
  var content = Blockly.Arduino.valueToCode(this, 'CONTENT', Blockly.Arduino.ORDER_ATOMIC) || '""';
  var code = 'sdWriteFile(' + path + ', ' + content + ');  // Write to SD card file\n';
  return code;
};

Blockly.Arduino.sdcard_read = function() {
  Blockly.Arduino.definitions_['include_sdcard_h'] = '#include "sdcard.h"\n';
  var path = Blockly.Arduino.valueToCode(this, 'PATH', Blockly.Arduino.ORDER_ATOMIC) || '"/default.txt"';
  var code = 'sdReadFile(' + path + ')  // Read SD card file content';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.sdcard_append = function() {
  Blockly.Arduino.definitions_['include_sdcard_h'] = '#include "sdcard.h"\n';
  var path = Blockly.Arduino.valueToCode(this, 'PATH', Blockly.Arduino.ORDER_ATOMIC) || '"/default.txt"';
  var content = Blockly.Arduino.valueToCode(this, 'CONTENT', Blockly.Arduino.ORDER_ATOMIC) || '""';
  var code = 'sdAppendFile(' + path + ', ' + content + ');  // Append to SD card file\n';
  return code;
};

Blockly.Arduino.sdcard_exists = function() {
  Blockly.Arduino.definitions_['include_sdcard_h'] = '#include "sdcard.h"\n';
  var path = Blockly.Arduino.valueToCode(this, 'PATH', Blockly.Arduino.ORDER_ATOMIC) || '"/default.txt"';
  var code = 'sdExists(' + path + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.sdcard_delete = function() {
  Blockly.Arduino.definitions_['include_sdcard_h'] = '#include "sdcard.h"\n';
  var path = Blockly.Arduino.valueToCode(this, 'PATH', Blockly.Arduino.ORDER_ATOMIC) || '"/default.txt"';
  var code = 'sdDeleteFile(' + path + ');\n';
  return code;
};

Blockly.Arduino.sdcard_test = function() {
  Blockly.Arduino.definitions_['include_sdcard_h'] = '#include "sdcard.h"\n';
  Blockly.Arduino.definitions_['include_oled_h'] = '#include "oled.h"\n';
  var code = 'testSDCard();\n';
  return code;
};
