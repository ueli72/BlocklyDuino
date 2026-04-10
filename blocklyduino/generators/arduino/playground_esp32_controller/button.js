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

// Override button block configuration for ESP32 Controller board while leaving
// Playground Master behaviour untouched.
(function() {
  if (typeof Blockly === 'undefined' || !Blockly.Blocks || !Blockly.Blocks['button_init']) {
    return;
  }

  var BOARD_ID = 'esp32-controller';
  var CONTROLLER_BUTTON_PINS = [
    ["Button1 (GPIO6)", "6"],
    ["Button2 (GPIO7)", "7"],
    ["Button3 (GPIO8)", "8"],
    ["Button4 (GPIO9)", "9"]
  ];

  var root = (typeof window !== 'undefined') ? window : (typeof globalThis !== 'undefined' ? globalThis : null);
  if (!root || root.__controllerButtonPatched) {
    return;
  }
  root.__controllerButtonPatched = true;

  function isControllerBoard() {
    if (typeof selectedBoard === 'string' && selectedBoard === BOARD_ID) {
      return true;
    }
    if (typeof selectedBoard === 'string' && selectedBoard && selectedBoard !== BOARD_ID) {
      return false;
    }
    try {
      if (typeof localStorage !== 'undefined') {
        return localStorage.getItem('blocklyduino_board') === BOARD_ID;
      }
    } catch (e) {
      // Ignore storage access issues (e.g. privacy mode)
    }
    return false;
  }

  var originalButtonInit = Blockly.Blocks['button_init'].init;
  var originalGetButtonPins = (typeof root.getButtonPins === 'function') ? root.getButtonPins : null;
  var originalGetInterruptPins = (typeof root.getInterruptPins === 'function') ? root.getInterruptPins : null;

  if (originalButtonInit) {
    Blockly.Blocks['button_init'].init = function() {
      if (!isControllerBoard()) {
        originalButtonInit.call(this);
        return;
      }

      this.setColour(30);
      this.appendDummyInput()
          .appendField("Button")
          .appendField(new Blockly.FieldImage("media/button.png", 64, 64))
          .appendField("Initialize");
      this.appendDummyInput("BUTTONS")
          .appendField("SW1")
          .appendField(new Blockly.FieldCheckbox("TRUE"), "SW1")
          .appendField("  SW2")
          .appendField(new Blockly.FieldCheckbox("TRUE"), "SW2")
          .appendField("  SW3")
          .appendField(new Blockly.FieldCheckbox("TRUE"), "SW3")
          .appendField("  SW4")
          .appendField(new Blockly.FieldCheckbox("TRUE"), "SW4");
      this.setPreviousStatement(true, "general");
      this.setNextStatement(true, "general");
      this.setTooltip('Initialize selected buttons');
    };
  }

  if (originalGetButtonPins) {
    root.getButtonPins = function() {
      if (isControllerBoard()) {
        return CONTROLLER_BUTTON_PINS.slice();
      }
      return originalGetButtonPins();
    };
  }

  if (originalGetInterruptPins) {
    root.getInterruptPins = function() {
      if (isControllerBoard()) {
        var pins = CONTROLLER_BUTTON_PINS.slice();
        for (var i = 0; i <= 48; i++) {
          if (i !== 6 && i !== 7 && i !== 8 && i !== 9) {
            pins.push(["GPIO" + i, String(i)]);
          }
        }
        return pins;
      }
      return originalGetInterruptPins();
    };
  }
})();

var button_constants = {
  '6': 'SW1_PIN',
  '7': 'SW2_PIN',
  '8': 'SW3_PIN',
  '9': 'SW4_PIN'
};

Blockly.Arduino.button_init = function() {
  Blockly.Arduino.definitions_['include_buttons_h'] = '#include "buttons.h"\n';
  var sw1 = this.getFieldValue('SW1') === 'TRUE' ? 'true' : 'false';
  var sw2 = this.getFieldValue('SW2') === 'TRUE' ? 'true' : 'false';
  var sw3 = this.getFieldValue('SW3') === 'TRUE' ? 'true' : 'false';
  var sw4 = this.getFieldValue('SW4') === 'TRUE' ? 'true' : 'false';
  var code = 'initializeButtons(' + sw1 + ', ' + sw2 + ', ' + sw3 + ', ' + sw4 + ');\n';
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

Blockly.Arduino.button_test = function() {
  Blockly.Arduino.definitions_['include_buttons_h'] = '#include "buttons.h"\n';
  var code = 'testButtons();\n';
  return code;
};

Blockly.Arduino.external_interrupt = function() {
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

  var isrCode = '// Interrupt Service Routine for button on pin ' + pin + '\n';
  isrCode += '// Triggered on ' + (mode === 'RISING' ? 'rising edge (button released)' : mode === 'FALLING' ? 'falling edge (button pressed)' : mode) + '\n';
  isrCode += 'void IRAM_ATTR ' + isrName + '() {\n' + branch + '}\n';
  
  // Store the function code so we can return it on subsequent calls
  Blockly.Arduino.generated_[blockKey] = isrCode;

  var button_constant = button_constants[pin];
  var pinCode = button_constant ? button_constant : pin;

  var setupCode = '// Configure button interrupt on pin ' + pin + '\n';
  setupCode += 'pinMode(' + pinCode + ', INPUT_PULLUP);\n';
  setupCode += 'attachInterrupt(digitalPinToInterrupt(' + pinCode + '), ' + isrName + ', ' + mode + ');\n';
  Blockly.Arduino.setups_['isr_' + isrName] = setupCode;

  return isrCode;
};
