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
 * @fileoverview Generating Arduino for KY023 Joystick blocks.
 */
'use strict';

Blockly.Arduino.ky023_init = function() {
  var x_pin = this.getFieldValue('X_PIN');
  var y_pin = this.getFieldValue('Y_PIN');
  var button_pin = this.getFieldValue('BUTTON_PIN');
  
  Blockly.Arduino.definitions_['include_ky023_h'] = '#include "ky023.h"\n';
  
  var code = 'initKY023(' + x_pin + ', ' + y_pin + ', ' + button_pin + ');  // Initialize joystick (X:' + x_pin + ', Y:' + y_pin + ', Button:' + button_pin + ')\n';
  return code;
};

Blockly.Arduino.ky023_read_x = function() {
  Blockly.Arduino.definitions_['include_ky023_h'] = '#include "ky023.h"\n';
  var code = 'readKY023X()  // Read joystick X-axis (0-4095)';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.ky023_read_y = function() {
  Blockly.Arduino.definitions_['include_ky023_h'] = '#include "ky023.h"\n';
  var code = 'readKY023Y()  // Read joystick Y-axis (0-4095)';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.ky023_read_button = function() {
  Blockly.Arduino.definitions_['include_ky023_h'] = '#include "ky023.h"\n';
  var code = 'isKY023ButtonPressed()  // Check if joystick button is pressed';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.ky023_test = function() {
  Blockly.Arduino.definitions_['include_ky023_h'] = '#include "ky023.h"\n';
  var code = 'testKY023();\n';
  return code;
};
