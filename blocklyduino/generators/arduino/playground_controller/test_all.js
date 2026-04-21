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
  var oled = this.getFieldValue('OLED') === 'TRUE';
  var internalLed = this.getFieldValue('INTERNAL_LED') === 'TRUE';
  var buttons = this.getFieldValue('BUTTONS') === 'TRUE';
  var haptic = this.getFieldValue('HAPTIC') === 'TRUE';
  var ky023 = this.getFieldValue('KY023') === 'TRUE';
  
  Blockly.Arduino.definitions_['include_test_all_h'] = '#include "test_all.h"\n';
  
  var mask = 0;
  if (oled) mask |= 1;          // TEST_OLED (1 << 0)
  if (internalLed) mask |= 2; // TEST_INTERNAL_LED (1 << 1)
  if (buttons) mask |= 4;       // TEST_BUTTONS (1 << 2)
  if (haptic) mask |= 8;        // TEST_HAPTIC (1 << 3)
  if (ky023) mask |= 16;        // TEST_KY023 (1 << 4)
  
  var code = 'runTestMenu(' + mask + ');\n';
  return code;
};
