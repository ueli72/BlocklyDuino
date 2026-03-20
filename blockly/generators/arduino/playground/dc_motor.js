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
 * @fileoverview Generating Arduino for DC Motor blocks.
 */
'use strict';

Blockly.Arduino.dc_motor_init = function() {
  Blockly.Arduino.definitions_['include_dcmotor_h'] = '#include "dcmotor.h"\n';
  var code = 'initDCMotors();\n';
  return code;
};

Blockly.Arduino.dc_motor_set = function() {
  var dropdown_motor = this.getFieldValue('MOTOR');
  var dropdown_direction = this.getFieldValue('DIRECTION');
  var value_speed = Blockly.Arduino.valueToCode(this, 'SPEED', Blockly.Arduino.ORDER_ATOMIC);
  Blockly.Arduino.definitions_['include_dcmotor_h'] = '#include "dcmotor.h"\n';
  var code = 'setDCSpeed(' + dropdown_motor + ', ' + dropdown_direction + ', ' + value_speed + ');\n';
  return code;
};

Blockly.Arduino.dc_motor_stop = function() {
  var dropdown_motor = this.getFieldValue('MOTOR');
  Blockly.Arduino.definitions_['include_dcmotor_h'] = '#include "dcmotor.h"\n';
  var code = 'setDCSpeed(' + dropdown_motor + ', FORWARD, 0);\n';
  return code;
};

Blockly.Arduino.dc_motor_test = function() {
  Blockly.Arduino.definitions_['include_dcmotor_h'] = '#include "dcmotor.h"\n';
  var code = 'testDCMotors();\n';
  return code;
};
