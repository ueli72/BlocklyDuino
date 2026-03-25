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
 * @fileoverview Generating Arduino for Global Array blocks.
 */
'use strict';

Blockly.Arduino.global_array = function() {
  var isVolatile = this.getFieldValue('VOLATILE') === 'TRUE';
  var type = this.getFieldValue('TYPE');
  var name = this.getFieldValue('NAME');
  var size = Blockly.Arduino.valueToCode(this, 'SIZE', Blockly.Arduino.ORDER_ATOMIC) || '10';
  
  var declaration = '';
  if (isVolatile) {
    declaration = 'volatile ' + type + ' ' + name + '[' + size + ']';
  } else {
    declaration = type + ' ' + name + '[' + size + ']';
  }
  declaration += ';\n';
  
  Blockly.Arduino.definitions_['global_array_' + name] = declaration;
  
  Blockly.Arduino.definitions_['global_array_size_' + name] = 
    'const int ' + name + '_SIZE = ' + size + ';\n';
  
  return '';
};

Blockly.Arduino.global_array_get = function() {
  var name = this.getFieldValue('NAME');
  var index = Blockly.Arduino.valueToCode(this, 'INDEX', Blockly.Arduino.ORDER_ATOMIC) || '0';
  var code = name + '[' + index + ']';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.global_array_set = function() {
  var name = this.getFieldValue('NAME');
  var index = Blockly.Arduino.valueToCode(this, 'INDEX', Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
  var value = Blockly.Arduino.valueToCode(this, 'VALUE', Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
  var code = name + '[' + index + '] = ' + value + ';\n';
  return code;
};

Blockly.Arduino.global_array_length = function() {
  var name = this.getFieldValue('NAME');
  var code = name + '_SIZE';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.global_array_fill = function() {
  var name = this.getFieldValue('NAME');
  var value = Blockly.Arduino.valueToCode(this, 'VALUE', Blockly.Arduino.ORDER_ASSIGNMENT) || '0';
  
  var code = 'for (int i = 0; i < ' + name + '_SIZE; i++) {\n';
  code += '  ' + name + '[i] = ' + value + ';\n';
  code += '}\n';
  
  return code;
};
