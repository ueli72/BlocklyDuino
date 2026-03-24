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
 * @fileoverview Generating Arduino for Timer blocks.
 */
'use strict';

Blockly.Arduino.async_timer = function() {
  var delay = Blockly.Arduino.valueToCode(this, 'DELAY', Blockly.Arduino.ORDER_ATOMIC) || '1000';
  var mode = this.getFieldValue('MODE');
  var branch = Blockly.Arduino.statementToCode(this, 'HANDLER_CODE');

  var timerVar = Blockly.Arduino.variableDB_.getDistinctName('timer', Blockly.Variables.NAME_TYPE);
  var timerTriggered = Blockly.Arduino.variableDB_.getDistinctName('timer_triggered', Blockly.Variables.NAME_TYPE);
  var timerLast = Blockly.Arduino.variableDB_.getDistinctName('timer_last', Blockly.Variables.NAME_TYPE);

  var code = '';
  
  if (mode === 'once') {
    Blockly.Arduino.definitions_[timerTriggered] = 'static bool ' + timerTriggered + ' = false;\n';
    Blockly.Arduino.definitions_[timerVar] = 'static unsigned long ' + timerVar + ' = 0;\n';
    
    code = 'if (!' + timerTriggered + ') {\n';
    code += '  if (' + timerVar + ' == 0) {\n';
    code += '    ' + timerVar + ' = millis();\n';
    code += '  }\n';
    code += '  if (millis() - ' + timerVar + ' >= ' + delay + ') {\n';
    code += '    ' + timerTriggered + ' = true;\n';
    code += branch;
    code += '  }\n';
    code += '}\n';
  } else {
    Blockly.Arduino.definitions_[timerLast] = 'static unsigned long ' + timerLast + ' = 0;\n';
    
    code = 'if (millis() - ' + timerLast + ' >= ' + delay + ') {\n';
    code += '  ' + timerLast + ' = millis();\n';
    code += branch;
    code += '}\n';
  }

  return code;
};
