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
  // Check if this block is inside the arduino_interrupts block
  var parent = this.getParent();
  var isInInterruptsBlock = false;
  while (parent) {
    if (parent.type === 'arduino_interrupts') {
      isInInterruptsBlock = true;
      break;
    }
    parent = parent.getParent();
  }
  
  if (!isInInterruptsBlock) {
    this.setWarningText(i18n.t('warnings.mustBeInInterrupts'));
    return '';
  }
  this.setWarningText(null);

  var delay = Blockly.Arduino.valueToCode(this, 'DELAY', Blockly.Arduino.ORDER_ATOMIC) || '1000';
  var mode = this.getFieldValue('MODE');

  // Use delay+mode as a unique key for this timer configuration
  var blockKey = 'timer_' + delay + '_' + mode;
  
  // If already generated, return the stored function code
  if (Blockly.Arduino.generated_[blockKey]) {
    return Blockly.Arduino.generated_[blockKey];
  }

  var branch = Blockly.Arduino.statementToCode(this, 'HANDLER_CODE');
  var timerName = Blockly.Arduino.variableDB_.getDistinctName('timer', Blockly.Variables.NAME_TYPE);
  var callbackName = Blockly.Arduino.variableDB_.getDistinctName('timer_callback', Blockly.Procedures.NAME_TYPE);

  // Include Ticker library
  Blockly.Arduino.definitions_['include_ticker'] = '#include <Ticker.h>\n';
  
  // Create Ticker object for this timer
  Blockly.Arduino.definitions_[timerName + '_obj'] = 'Ticker ' + timerName + ';  // Timer object for periodic/repeated execution\n';

  // Create callback function (returned to be placed in Interrupts block)
  var callbackCode = '// Timer callback - executed every ' + delay + 'ms (' + (mode === 'once' ? 'once' : 'repeated') + ')\n';
  callbackCode += 'void ' + callbackName + '() {\n' + branch + '}\n';
  
  // Store the function code so we can return it on subsequent calls
  Blockly.Arduino.generated_[blockKey] = callbackCode;

  // Setup code to attach the timer (goes to setup)
  var setupCode = '';
  if (mode === 'once') {
    setupCode = '// Start one-shot timer: ' + callbackName + ' after ' + delay + 'ms\n';
    setupCode += timerName + '.once_ms(' + delay + ', ' + callbackName + ');\n';
  } else {
    setupCode = '// Start periodic timer: ' + callbackName + ' every ' + delay + 'ms\n';
    setupCode += timerName + '.attach_ms(' + delay + ', ' + callbackName + ');\n';
  }
  Blockly.Arduino.setups_['timer_' + timerName] = setupCode;

  return callbackCode;
};
