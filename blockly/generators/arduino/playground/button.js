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
 * @fileoverview Generating Arduino for Button blocks.
 */
'use strict';

var button_constants = {
  '1': 'SW1_PIN',
  '4': 'SW2_PIN',
  '3': 'SW3_PIN',
  '2': 'SW4_PIN'
};

Blockly.Arduino.button_init = function() {
  Blockly.Arduino.definitions_['include_buttons_h'] = '#include "buttons.h"\n';
  var code = 'initializeButtons();\n';
  return code;
};

Blockly.Arduino.button_read = function() {
  var dropdown_pin = this.getFieldValue('PIN');
  var button_constant = button_constants[dropdown_pin];

  if (button_constant) {
    Blockly.Arduino.definitions_['include_buttons_h'] = '#include "buttons.h"\n';
    var code = 'digitalRead(' + button_constant + ') == LOW';
  } else {
    var code = 'digitalRead(' + dropdown_pin + ') == LOW';
  }
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.button_interrupt = function() {
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

  var pin = this.getFieldValue('PIN');
  var mode = this.getFieldValue('MODE');
  
  // Use pin+mode as a unique key for this interrupt configuration
  var blockKey = 'isr_' + pin + '_' + mode;
  
  // If already generated, return the stored function code
  if (Blockly.Arduino.generated_[blockKey]) {
    return Blockly.Arduino.generated_[blockKey];
  }

  var branch = Blockly.Arduino.statementToCode(this, 'HANDLER_CODE');
  var isrName = Blockly.Arduino.variableDB_.getDistinctName('isr_handler', Blockly.Procedures.NAME_TYPE);

  var isrCode = 'void IRAM_ATTR ' + isrName + '() {\n' + branch + '}\n';
  
  // Store the function code so we can return it on subsequent calls
  Blockly.Arduino.generated_[blockKey] = isrCode;

  var button_constant = button_constants[pin];
  var pinCode = button_constant ? button_constant : pin;

  var setupCode = 'pinMode(' + pinCode + ', INPUT_PULLUP);\n';
  setupCode += 'attachInterrupt(digitalPinToInterrupt(' + pinCode + '), ' + isrName + ', ' + mode + ');\n';
  Blockly.Arduino.setups_['isr_' + isrName] = setupCode;

  return isrCode;
};
