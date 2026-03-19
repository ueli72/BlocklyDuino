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
 * @fileoverview Generating Arduino for SG90 Servo blocks.
 */
'use strict';

Blockly.Arduino.servo_sg90_move = function() {
  var dropdown_pin = this.getFieldValue('PIN');
  var value_degree = Blockly.Arduino.valueToCode(this, 'DEGREE', Blockly.Arduino.ORDER_ATOMIC);

  Blockly.Arduino.definitions_['define_servo'] = '#include <Servo.h>\n';
  Blockly.Arduino.definitions_['var_sg90_servo' + dropdown_pin] = 'Servo sg90_servo_' + dropdown_pin + ';\n';
  Blockly.Arduino.setups_['setup_sg90_servo_' + dropdown_pin] = 'sg90_servo_' + dropdown_pin + '.attach(' + dropdown_pin + ');\n';

  var code = 'sg90_servo_' + dropdown_pin + '.write(' + value_degree + ');\n';
  return code;
};

Blockly.Arduino.servo_sg90_read_degrees = function() {
  var dropdown_pin = this.getFieldValue('PIN');

  Blockly.Arduino.definitions_['define_servo'] = '#include <Servo.h>\n';
  Blockly.Arduino.definitions_['var_sg90_servo' + dropdown_pin] = 'Servo sg90_servo_'+dropdown_pin+';\n';
  Blockly.Arduino.setups_['setup_sg90_servo_' + dropdown_pin] = 'sg90_servo_' + dropdown_pin + '.attach(' + dropdown_pin + ');\n';

  var code = 'sg90_servo_' + dropdown_pin + '.read()';
  return code;
};
