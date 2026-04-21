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
 * @fileoverview Generating Arduino for Cast blocks.
 */
'use strict';

Blockly.Arduino.variable_cast = function() {
  var type = this.getFieldValue('TYPE');
  var value = Blockly.Arduino.valueToCode(this, 'VALUE', Blockly.Arduino.ORDER_ATOMIC) || '0';
  var code = '(' + type + ')(' + value + ')';
  return [code, Blockly.Arduino.ORDER_CAST];
};

Blockly.Arduino.byte_to_array = function() {
  var value = Blockly.Arduino.valueToCode(this, 'BYTE', Blockly.Arduino.ORDER_ATOMIC) || '0';
  var code = 'std::vector<uint8_t>(1, (uint8_t)(' + value + '))';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
