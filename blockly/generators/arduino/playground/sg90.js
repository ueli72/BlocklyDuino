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

// Servo number mapping for predefined servos
var sg90_servo_constants = {
  '37': 'SERVO1',
  '38': 'SERVO2',
  '45': 'SERVO3'
};

Blockly.Arduino.servo_sg90_init = function() {
  Blockly.Arduino.definitions_['include_servos_h'] = '#include "servos.h"\n';
  var code = 'initializeServos();\n';
  return code;
};

Blockly.Arduino.servo_sg90_move = function() {
  var dropdown_pin = this.getFieldValue('PIN');
  var value_degree = Blockly.Arduino.valueToCode(this, 'DEGREE', Blockly.Arduino.ORDER_ATOMIC);
  var servo_constant = sg90_servo_constants[dropdown_pin];

  if (servo_constant) {
    // Use existing servos.cpp functions for predefined servos
    Blockly.Arduino.definitions_['include_servos_h'] = '#include "servos.h"\n';
    var code = 'setServoAngle(' + servo_constant + ', ' + value_degree + ');\n';
  } else {
    // Fallback for other pins
    Blockly.Arduino.definitions_['define_servo'] = '#include <Servo.h>\n';
    Blockly.Arduino.definitions_['var_sg90_servo' + dropdown_pin] = 'Servo sg90_servo_' + dropdown_pin + ';\n';
    var code = 'sg90_servo_' + dropdown_pin + '.attach(' + dropdown_pin + ');\n';
    code += 'sg90_servo_' + dropdown_pin + '.write(' + value_degree + ');\n';
  }
  return code;
};

Blockly.Arduino.servo_sg90_read_degrees = function() {
  var dropdown_pin = this.getFieldValue('PIN');
  var servo_constant = sg90_servo_constants[dropdown_pin];

  if (servo_constant) {
    // Use existing servos.cpp for predefined servos
    Blockly.Arduino.definitions_['include_servos_h'] = '#include "servos.h"\n';
    // Note: servos.cpp doesn't have a read function, return servo constant
    var code = servo_constant + ' // Servo' + servo_constant.replace('SERVO', '') + ' - use setServoAngle() to set position';
  } else {
    // Fallback for other pins
    Blockly.Arduino.definitions_['define_servo'] = '#include <Servo.h>\n';
    Blockly.Arduino.definitions_['var_sg90_servo' + dropdown_pin] = 'Servo sg90_servo_' + dropdown_pin + ';\n';
    var code = 'sg90_servo_' + dropdown_pin + '.read()';
  }
  return code;
};

Blockly.Arduino.servo_sg90_test_sweep = function() {
  var dropdown_pin = this.getFieldValue('PIN');
  var servo_constant = sg90_servo_constants[dropdown_pin];

  if (servo_constant) {
    Blockly.Arduino.definitions_['include_servos_h'] = '#include "servos.h"\n';
    var code = 'testServoSweep(' + servo_constant + ');\n';
  } else {
    Blockly.Arduino.definitions_['define_servo'] = '#include <Servo.h>\n';
    Blockly.Arduino.definitions_['var_sg90_servo' + dropdown_pin] = 'Servo sg90_servo_' + dropdown_pin + ';\n';
    var code = 'sg90_servo_' + dropdown_pin + '.attach(' + dropdown_pin + ');\n';
    code += 'for (int angle = 0; angle <= 180; angle++) { sg90_servo_' + dropdown_pin + '.write(angle); delay(10); }\n';
    code += 'for (int angle = 180; angle >= 0; angle--) { sg90_servo_' + dropdown_pin + '.write(angle); delay(10); }\n';
  }
  return code;
};
