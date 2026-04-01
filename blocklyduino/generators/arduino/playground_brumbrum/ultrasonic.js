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
 * @fileoverview Generating Arduino for ultrasonic sensor blocks.
 */
'use strict';

Blockly.Arduino.ultrasonic_read = function() {
  var sensor = this.getFieldValue('SENSOR');
  Blockly.Arduino.definitions_['include_ultrasonic_h'] = '#include "ultrasonic.h"\n';
  var code = 'measureDistance(' + sensor + ')  // Read distance from ultrasonic sensor ' + sensor + ' (in cm)';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.ultrasonic_test = function() {
  Blockly.Arduino.definitions_['include_ultrasonic_h'] = '#include "ultrasonic.h"\n';
  var code = 'testUltrasonicOLED();\n';
  return code;
};
