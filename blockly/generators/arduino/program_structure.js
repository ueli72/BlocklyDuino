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
 * @fileoverview Generating Arduino for Setup and Loop blocks.
 */
'use strict';

Blockly.Arduino.arduino_setup = function() {
  var setupCode = Blockly.Arduino.statementToCode(this, 'SETUP_CODE');
  return setupCode;
};

Blockly.Arduino.arduino_loop = function() {
  var loopCode = Blockly.Arduino.statementToCode(this, 'LOOP_CODE');
  return loopCode;
};
