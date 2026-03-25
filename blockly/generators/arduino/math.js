/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
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
 * @fileoverview Generating Arduino for math blocks.
 * @author gasolin@gmail.com  (Fred Lin)
 */
'use strict';




Blockly.Arduino.math_number = function() {
  // Numeric value.
  var code = window.parseFloat(this.getFieldValue('NUM'));
  // -4.abs() returns -4 in Dart due to strange order of operation choices.
  // -4 is actually an operator and a number.  Reflect this in the order.
  var order = code < 0 ?
      Blockly.Arduino.ORDER_UNARY_PREFIX : Blockly.Arduino.ORDER_ATOMIC;
  return [code, order];
};

Blockly.Arduino.math_arithmetic = function() {
  // Basic arithmetic operators, and power.
  var mode = this.getFieldValue('OP');
  var tuple = Blockly.Arduino.math_arithmetic.OPERATORS[mode];
  var operator = tuple[0];
  var order = tuple[1];
  var argument0 = Blockly.Arduino.valueToCode(this, 'A', order) || '0';
  var argument1 = Blockly.Arduino.valueToCode(this, 'B', order) || '0';
  var code;
  if (!operator) {
    code = 'Math.pow(' + argument0 + ', ' + argument1 + ')';
    return [code, Blockly.Arduino.ORDER_UNARY_POSTFIX];
  }
  code = argument0 + operator + argument1;
  return [code, order];
};

Blockly.Arduino.math_arithmetic.OPERATORS = {
  ADD: [' + ', Blockly.Arduino.ORDER_ADDITIVE],
  MINUS: [' - ', Blockly.Arduino.ORDER_ADDITIVE],
  MULTIPLY: [' * ', Blockly.Arduino.ORDER_MULTIPLICATIVE],
  DIVIDE: [' / ', Blockly.Arduino.ORDER_MULTIPLICATIVE],
  POWER: [null, Blockly.Arduino.ORDER_NONE]  // Handle power separately.
};

Blockly.Arduino.math_sqrt = function() {
  Blockly.Arduino.definitions_['include_math_h'] = '#include <math.h>\n';
  var num = Blockly.Arduino.valueToCode(this, 'NUM', Blockly.Arduino.ORDER_NONE) || '0';
  return ['sqrt(' + num + ')', Blockly.Arduino.ORDER_UNARY_POSTFIX];
};

Blockly.Arduino.math_nth_root = function() {
  Blockly.Arduino.definitions_['include_math_h'] = '#include <math.h>\n';
  var root = Blockly.Arduino.valueToCode(this, 'ROOT', Blockly.Arduino.ORDER_NONE) || '2';
  var num = Blockly.Arduino.valueToCode(this, 'NUM', Blockly.Arduino.ORDER_NONE) || '0';
  return ['pow(' + num + ', 1.0/' + root + ')', Blockly.Arduino.ORDER_UNARY_POSTFIX];
};

Blockly.Arduino.math_sin = function() {
  Blockly.Arduino.definitions_['include_math_h'] = '#include <math.h>\n';
  var num = Blockly.Arduino.valueToCode(this, 'NUM', Blockly.Arduino.ORDER_NONE) || '0';
  return ['sin((' + num + ') * DEG_TO_RAD)', Blockly.Arduino.ORDER_UNARY_POSTFIX];
};

Blockly.Arduino.math_cos = function() {
  Blockly.Arduino.definitions_['include_math_h'] = '#include <math.h>\n';
  var num = Blockly.Arduino.valueToCode(this, 'NUM', Blockly.Arduino.ORDER_NONE) || '0';
  return ['cos((' + num + ') * DEG_TO_RAD)', Blockly.Arduino.ORDER_UNARY_POSTFIX];
};

Blockly.Arduino.math_deg2rad = function() {
  var num = Blockly.Arduino.valueToCode(this, 'NUM', Blockly.Arduino.ORDER_NONE) || '0';
  return ['(' + num + ') * DEG_TO_RAD', Blockly.Arduino.ORDER_MULTIPLICATIVE];
};

Blockly.Arduino.math_rad2deg = function() {
  var num = Blockly.Arduino.valueToCode(this, 'NUM', Blockly.Arduino.ORDER_NONE) || '0';
  return ['(' + num + ') * RAD_TO_DEG', Blockly.Arduino.ORDER_MULTIPLICATIVE];
};

Blockly.Arduino.math_power = function() {
  Blockly.Arduino.definitions_['include_math_h'] = '#include <math.h>\n';
  var base = Blockly.Arduino.valueToCode(this, 'BASE', Blockly.Arduino.ORDER_NONE) || '0';
  var exp = Blockly.Arduino.valueToCode(this, 'EXP', Blockly.Arduino.ORDER_NONE) || '0';
  return ['pow(' + base + ', ' + exp + ')', Blockly.Arduino.ORDER_UNARY_POSTFIX];
};

Blockly.Arduino.math_random = function() {
  var type = this.getFieldValue('TYPE');
  
  if (type === 'BOOL') {
    return ['(random(0, 2) == 1)', Blockly.Arduino.ORDER_EQUALITY];
  }
  
  var min = Blockly.Arduino.valueToCode(this, 'MIN', Blockly.Arduino.ORDER_NONE) || '0';
  var max = Blockly.Arduino.valueToCode(this, 'MAX', Blockly.Arduino.ORDER_NONE) || '100';
  
  if (type === 'INT') {
    return ['random(' + min + ', ' + max + ' + 1)', Blockly.Arduino.ORDER_UNARY_POSTFIX];
  } else {
    return ['(random(' + min + ', ' + max + ') + (random(0, 1000) / 1000.0))', Blockly.Arduino.ORDER_UNARY_POSTFIX];
  }
};
