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
 * @fileoverview Generating Arduino for Interrupt blocks (Arduino Uno).
 * Note: Arduino Uno has no built-in buttons, so only external_interrupt is provided.
 */
'use strict';

Blockly.Arduino.external_interrupt = function() {
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

  var pin = this.getFieldValue('PIN');
  var mode = this.getFieldValue('MODE');
  
  var blockKey = 'isr_' + pin + '_' + mode;
  
  if (Blockly.Arduino.generated_[blockKey]) {
    return Blockly.Arduino.generated_[blockKey];
  }

  var branch = Blockly.Arduino.statementToCode(this, 'HANDLER_CODE');
  var isrName = Blockly.Arduino.variableDB_.getDistinctName('isr_handler', Blockly.Procedures.NAME_TYPE);

  var isrCode = '// Interrupt Service Routine for pin ' + pin + '\n';
  isrCode += '// Triggered on ' + (mode === 'RISING' ? 'rising edge' : mode === 'FALLING' ? 'falling edge' : mode) + '\n';
  isrCode += 'void ' + isrName + '() {\n' + branch + '}\n';
  
  Blockly.Arduino.generated_[blockKey] = isrCode;

  var setupCode = '// Configure interrupt on pin ' + pin + '\n';
  setupCode += 'pinMode(' + pin + ', INPUT_PULLUP);\n';
  setupCode += 'attachInterrupt(digitalPinToInterrupt(' + pin + '), ' + isrName + ', ' + mode + ');\n';
  Blockly.Arduino.setups_['isr_' + isrName] = setupCode;

  return isrCode;
};
