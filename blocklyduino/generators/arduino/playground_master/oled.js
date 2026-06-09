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
 */
'use strict';

Blockly.Arduino.oled_init = function() {
  var dropdown_rotation = this.getFieldValue('ROTATION');
  Blockly.Arduino.definitions_['include_oled_h'] = '#include "oled.h"\n';
  var code = 'initOLED(' + dropdown_rotation + ');\n';
  return code;
};

Blockly.Arduino.oled_write = function() {
  var text = Blockly.Arduino.valueToCode(this, 'TEXT', Blockly.Arduino.ORDER_ATOMIC) || '""';

  Blockly.Arduino.definitions_['include_oled_h'] = '#include "oled.h"\n';

  var code = 'writeToOled(' + text + ');\n';
  return code;
};

Blockly.Arduino.oled_clear = function() {
  Blockly.Arduino.definitions_['include_oled_h'] = '#include "oled.h"\n';

  var code = 'clearOled();\n';
  return code;
};

Blockly.Arduino.oled_test = function() {
  Blockly.Arduino.definitions_['include_oled_h'] = '#include "oled.h"\n';

  var code = 'testOLED();\n';
  return code;
};
