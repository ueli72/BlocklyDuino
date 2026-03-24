/**
 * @license
 * Visual Blocks Editor
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
 * @fileoverview Button blocks.
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.button = {};

function getButtonPins() {
  return [
    ["Button1 (GPIO4)", "4"],
    ["Button2 (GPIO5)", "5"],
    ["Button3 (GPIO6)", "6"],
    ["Button4 (GPIO7)", "7"]
  ];
}

Blockly.Blocks['button_init'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("Button")
        .appendField(new Blockly.FieldImage("../../media/button.png", 64, 64))
        .appendField("Initialize");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Initialize all buttons');
  }
};

Blockly.Blocks['button_read'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("Button")
        .appendField(new Blockly.FieldImage("../../media/button.png", 64, 64))
        .appendField("Read")
        .appendField(new Blockly.FieldDropdown(getButtonPins), "PIN");
    this.setOutput(true, 'Boolean');
    this.setTooltip('Read button state (true = pressed, false = not pressed)');
  }
};

function getInterruptPins() {
  var pins = getButtonPins();
  for (var i = 0; i <= 48; i++) {
    if (i !== 4 && i !== 5 && i !== 6 && i !== 7) {
      pins.push(["GPIO" + i, String(i)]);
    }
  }
  return pins;
}

function getInterruptModes() {
  return [
    ["FALLING (press)", "FALLING"],
    ["RISING (release)", "RISING"],
    ["CHANGE", "CHANGE"]
  ];
}

Blockly.Blocks['button_interrupt'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("../../media/trigger.png", 64, 64))
        .appendField("On Interrupt")
        .appendField(new Blockly.FieldDropdown(getInterruptPins), "PIN")
        .appendField(new Blockly.FieldDropdown(getInterruptModes), "MODE");
    this.appendStatementInput("HANDLER_CODE")
        .appendField("do");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('ISR: No delay(), no Serial, keep short! Use volatile variables for data shared with main loop.');
  }
};
