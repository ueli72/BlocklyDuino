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
 * @fileoverview Generating Arduino for KY023 Dual Joystick blocks.
 */
'use strict';

Blockly.Arduino.ky023_init = function() {
  var init_left = this.getFieldValue('INIT_LEFT') === 'TRUE';
  var init_right = this.getFieldValue('INIT_RIGHT') === 'TRUE';
  
  Blockly.Arduino.definitions_['include_ky023_h'] = '#include "ky023.h"\n';
  
  var code = '';
  if (init_left) {
    code += 'initJoyLeft();  // Initialize JoyLeft: X=GPIO1, Y=GPIO2, SW=GPIO0\n';
  }
  if (init_right) {
    code += 'initJoyRight();  // Initialize JoyRight: X=GPIO4, Y=GPIO5, SW=GPIO3\n';
  }
  return code;
};

Blockly.Arduino.ky023_read_x = function() {
  var joystick = this.getFieldValue('JOYSTICK');
  
  Blockly.Arduino.definitions_['include_ky023_h'] = '#include "ky023.h"\n';
  
  var code = (joystick === 'LEFT') ? 'readJoyLeftX()' : 'readJoyRightX()';
  code += '  // Read ' + joystick + ' X-axis (0-4095)';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.ky023_read_y = function() {
  var joystick = this.getFieldValue('JOYSTICK');
  
  Blockly.Arduino.definitions_['include_ky023_h'] = '#include "ky023.h"\n';
  
  var code = (joystick === 'LEFT') ? 'readJoyLeftY()' : 'readJoyRightY()';
  code += '  // Read ' + joystick + ' Y-axis (0-4095)';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.ky023_read_button = function() {
  var joystick = this.getFieldValue('JOYSTICK');
  
  Blockly.Arduino.definitions_['include_ky023_h'] = '#include "ky023.h"\n';
  
  var code = (joystick === 'LEFT') ? 'isJoyLeftPressed()' : 'isJoyRightPressed()';
  code += '  // Check if ' + joystick + ' button is pressed (active LOW)';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.ky023_test = function() {
  Blockly.Arduino.definitions_['include_ky023_h'] = '#include "ky023.h"\n';
  var code = 'testKY023();  // Test both joysticks\n';
  return code;
};
