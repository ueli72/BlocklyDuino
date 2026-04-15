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
 * @fileoverview Generating Arduino for OLED Menu blocks.
 */
'use strict';

Blockly.Arduino.oled_menu = function() {
  var yPin = this.getFieldValue('Y_PIN');
  var buttonPin = this.getFieldValue('BUTTON_PIN');
  var title = Blockly.Arduino.valueToCode(this, 'TITLE', Blockly.Arduino.ORDER_ATOMIC) || '"Select"';
  var items = Blockly.Arduino.valueToCode(this, 'ITEMS', Blockly.Arduino.ORDER_ATOMIC) || 'std::vector<String>()';
  
  Blockly.Arduino.definitions_['include_menu_h'] = '#include "menu.h"\n';
  
  var code = 'showMenu(' + items + ', ' + title + ', ' + yPin + ', ' + buttonPin + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
