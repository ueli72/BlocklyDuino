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
 */
'use strict';

Blockly.Arduino.internal_led_init = function() {
  Blockly.Arduino.definitions_['include_internal_led_h'] = '#include "internalLED.h"\n';
  var code = 'initializeLED();  // Initialize built-in RGB LED\n';
  return code;
};

Blockly.Arduino.internal_led_set = function() {
  var red = Blockly.Arduino.valueToCode(this, 'RED', Blockly.Arduino.ORDER_ATOMIC) || '0';
  var green = Blockly.Arduino.valueToCode(this, 'GREEN', Blockly.Arduino.ORDER_ATOMIC) || '0';
  var blue = Blockly.Arduino.valueToCode(this, 'BLUE', Blockly.Arduino.ORDER_ATOMIC) || '0';

  Blockly.Arduino.definitions_['include_internal_led_h'] = '#include "internalLED.h"\n';

  var code = 'setLED(' + red + ', ' + green + ', ' + blue + ');  // Set RGB color (R:' + red + ', G:' + green + ', B:' + blue + ')\n';
  return code;
};

Blockly.Arduino.internal_led_off = function() {
  Blockly.Arduino.definitions_['include_internal_led_h'] = '#include "internalLED.h"\n';

  var code = 'turnOffLED();  // Turn off built-in LED\n';
  return code;
};

Blockly.Arduino.internal_led_test = function() {
  Blockly.Arduino.definitions_['include_internal_led_h'] = '#include "internalLED.h"\n';

  var code = 'runLEDInitTest();\n';
  return code;
};
