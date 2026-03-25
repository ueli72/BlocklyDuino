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
 * @fileoverview Generating Arduino for constants blocks.
 */
'use strict';

Blockly.Arduino.constants_true = function() {
  return ['true', Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.constants_false = function() {
  return ['false', Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.constants_pi = function() {
  return ['3.14159265358979323846', Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.constants_sqrt2 = function() {
  return ['1.41421356237309504880', Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.constants_sqrt3 = function() {
  return ['1.73205080756887729352', Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.constants_e = function() {
  return ['2.71828182845904523536', Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.constants_golden_ratio = function() {
  return ['1.61803398874989484820', Blockly.Arduino.ORDER_ATOMIC];
};
