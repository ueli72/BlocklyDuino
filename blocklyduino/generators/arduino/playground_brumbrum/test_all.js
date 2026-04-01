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
 * @fileoverview Generating Arduino for Test All block.
 */
'use strict';

Blockly.Arduino.test_all = function() {
  var ledMatrix = this.getFieldValue('LED_MATRIX') === 'TRUE';
  var relais = this.getFieldValue('RELAIS') === 'TRUE';
  var dcMotor = this.getFieldValue('DC_MOTOR') === 'TRUE';
  var ultrasonic = this.getFieldValue('ULTRASONIC') === 'TRUE';
  var sdCard = this.getFieldValue('SD_CARD') === 'TRUE';
  var max98357a = this.getFieldValue('MAX98357A') === 'TRUE';
  var internalLed = this.getFieldValue('INTERNAL_LED') === 'TRUE';
  var sg90Servo = this.getFieldValue('SG90_SERVO') === 'TRUE';
  
  Blockly.Arduino.definitions_['include_test_all_h'] = '#include "test_all.h"\n';
  
  var mask = 0;
  if (ledMatrix) mask |= 1;
  if (relais) mask |= 2;
  if (dcMotor) mask |= 4;
  if (ultrasonic) mask |= 16;
  if (sdCard) mask |= 32;
  if (max98357a) mask |= 64;
  if (internalLed) mask |= 128;
  if (sg90Servo) mask |= 256;
  
  var code = 'runTestMenu(' + mask + ');\n';
  return code;
};
