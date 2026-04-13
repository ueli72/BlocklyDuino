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
 * @fileoverview Generating Arduino for Internal LED blocks.
 * Simple on/off LED on GPIO8 (active LOW) for ESP32-C3 0.42 OLED board.
 */
'use strict';

Blockly.Arduino.esp32_controller_led_init = function() {
  Blockly.Arduino.definitions_['led_pin'] = '#define LED_PIN 8\n';
  Blockly.Arduino.setups_['led_init'] = 'pinMode(LED_PIN, OUTPUT);  // Initialize built-in LED pin\n';
  var code = '';
  return code;
};

Blockly.Arduino.esp32_controller_led_set = function() {
  var state = this.getFieldValue('STATE');
  Blockly.Arduino.definitions_['led_pin'] = '#define LED_PIN 8\n';
  var code = 'digitalWrite(LED_PIN, ' + (state === 'ON' ? 'LOW' : 'HIGH') + ');  // LED ' + state.toLowerCase() + ' (active LOW)\n';
  return code;
};
