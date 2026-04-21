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
 * @fileoverview Generating Arduino for Haptic Actuator blocks.
 */
'use strict';

Blockly.Arduino.haptic_init = function() {
  Blockly.Arduino.definitions_['include_haptic_h'] = '#include "haptic.h"\n';
  var code = 'initHaptic();  // Initialize haptic actuator on GPIO 20 (UART RX)\n';
  return code;
};

Blockly.Arduino.haptic_turn_on = function() {
  Blockly.Arduino.definitions_['include_haptic_h'] = '#include "haptic.h"\n';
  var code = 'hapticOn();  // Turn haptic actuator ON\n';
  return code;
};

Blockly.Arduino.haptic_turn_off = function() {
  Blockly.Arduino.definitions_['include_haptic_h'] = '#include "haptic.h"\n';
  var code = 'hapticOff();  // Turn haptic actuator OFF\n';
  return code;
};

Blockly.Arduino.haptic_vibrate = function() {
  var duration = Blockly.Arduino.valueToCode(this, 'DURATION', Blockly.Arduino.ORDER_ATOMIC) || '500';
  Blockly.Arduino.definitions_['include_haptic_h'] = '#include "haptic.h"\n';
  var code = 'hapticVibrate(' + duration + ');  // Vibrate for ' + duration + 'ms (non-blocking)\n';
  return code;
};
