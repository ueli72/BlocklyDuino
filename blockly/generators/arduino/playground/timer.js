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
 * @fileoverview Generating Arduino for Timer blocks using Ticker library.
 */
'use strict';

Blockly.Arduino.async_timer = function() {
  var delay = Blockly.Arduino.valueToCode(this, 'DELAY', Blockly.Arduino.ORDER_ATOMIC) || '1000';
  var mode = this.getFieldValue('MODE');
  var branch = Blockly.Arduino.statementToCode(this, 'HANDLER_CODE');

  var timerName = Blockly.Arduino.variableDB_.getDistinctName('timer', Blockly.Variables.NAME_TYPE);
  var callbackName = Blockly.Arduino.variableDB_.getDistinctName('timer_callback', Blockly.Procedures.NAME_TYPE);

  // Include Ticker library
  Blockly.Arduino.definitions_['include_ticker'] = '#include <Ticker.h>\n';
  
  // Create Ticker object
  Blockly.Arduino.definitions_[timerName + '_obj'] = 'Ticker ' + timerName + ';\n';

  // Create callback function
  var callbackCode = 'void ' + callbackName + '() {\n' + branch + '}\n';
  Blockly.Arduino.definitions_[callbackName] = callbackCode;

  // Setup code to attach the timer
  var code = '';
  if (mode === 'once') {
    code = timerName + '.once_ms(' + delay + ', ' + callbackName + ');\n';
  } else {
    code = timerName + '.attach_ms(' + delay + ', ' + callbackName + ');\n';
  }

  return code;
};
