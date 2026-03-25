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
 * @fileoverview Generating Arduino for Global Variable blocks.
 */
'use strict';

Blockly.Arduino.global_variable = function() {
  var isVolatile = this.getFieldValue('VOLATILE') === 'TRUE';
  var type = this.getFieldValue('TYPE');
  var name = this.getFieldValue('NAME');
  var value = Blockly.Arduino.valueToCode(this, 'VALUE', Blockly.Arduino.ORDER_ATOMIC);
  
  var declaration = '';
  if (isVolatile) {
    declaration = 'volatile ' + type + ' ' + name;
  } else {
    declaration = type + ' ' + name;
  }
  
  if (value) {
    declaration += ' = ' + value;
  }
  declaration += ';\n';
  
  Blockly.Arduino.definitions_['global_var_' + name] = declaration;
  
  return '';
};

Blockly.Arduino.global_variable_get = function() {
  var name = this.getFieldValue('NAME');
  var code = name;
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.global_variable_set = function() {
  var name = this.getFieldValue('NAME');
  var value = Blockly.Arduino.valueToCode(this, 'VALUE', Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
  var code = name + ' = ' + value + ';\n';
  return code;
};
