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
 * @fileoverview Generating Arduino for KY023 Dual Joystick blocks with selectable pins.
 */
'use strict';

Blockly.Arduino.ky023_init = function() {
  var init_left = this.getFieldValue('INIT_LEFT') === 'TRUE';
  var init_right = this.getFieldValue('INIT_RIGHT') === 'TRUE';
  
  var left_x = this.getFieldValue('LEFT_X_PIN');
  var left_y = this.getFieldValue('LEFT_Y_PIN');
  var left_btn = this.getFieldValue('LEFT_BTN_PIN');
  
  var right_x = this.getFieldValue('RIGHT_X_PIN');
  var right_y = this.getFieldValue('RIGHT_Y_PIN');
  var right_btn = this.getFieldValue('RIGHT_BTN_PIN');
  
  Blockly.Arduino.definitions_['include_ky023_h'] = '#include "ky023.h"\n';
  
  var code = '';
  if (init_left) {
    code += 'initJoyLeft(' + left_x + ', ' + left_y + ', ' + left_btn + ');  // JoyLeft: X=' + left_x + ', Y=' + left_y + ', SW=' + left_btn + '\n';
  }
  if (init_right) {
    code += 'initJoyRight(' + right_x + ', ' + right_y + ', ' + right_btn + ');  // JoyRight: X=' + right_x + ', Y=' + right_y + ', SW=' + right_btn + '\n';
  }
  return code;
};

Blockly.Arduino.ky023_read_x = function() {
  var joystick = this.getFieldValue('JOYSTICK');
  
  Blockly.Arduino.definitions_['include_ky023_h'] = '#include "ky023.h"\n';
  
  var code = (joystick === 'LEFT') ? 'readJoyLeftX()' : 'readJoyRightX()';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.ky023_read_y = function() {
  var joystick = this.getFieldValue('JOYSTICK');
  
  Blockly.Arduino.definitions_['include_ky023_h'] = '#include "ky023.h"\n';
  
  var code = (joystick === 'LEFT') ? 'readJoyLeftY()' : 'readJoyRightY()';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.ky023_read_button = function() {
  var joystick = this.getFieldValue('JOYSTICK');
  
  Blockly.Arduino.definitions_['include_ky023_h'] = '#include "ky023.h"\n';
  
  var code = (joystick === 'LEFT') ? 'isJoyLeftPressed()' : 'isJoyRightPressed()';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.ky023_test = function() {
  Blockly.Arduino.definitions_['include_ky023_h'] = '#include "ky023.h"\n';
  Blockly.Arduino.definitions_['include_oled_h'] = '#include "oled.h"\n';
  var code = 'testKY023();  // Test both joysticks (initializes OLED internally)\n';
  return code;
};
