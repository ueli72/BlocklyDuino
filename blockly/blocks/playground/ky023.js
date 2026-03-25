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
 * @fileoverview KY023 Joystick Module blocks.
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.ky023 = {};

var KY023_ANALOG_PINS = {
  'esp32-s3-devkitc1': [
    ["GPIO1", "1"],
    ["GPIO2", "2"],
    ["GPIO3", "3"],
    ["GPIO4", "4"],
    ["GPIO5", "5"],
    ["GPIO6", "6"],
    ["GPIO7", "7"],
    ["GPIO8", "8"],
    ["GPIO9", "9"],
    ["GPIO10", "10"],
    ["GPIO11", "11"],
    ["GPIO12", "12"],
    ["GPIO13", "13"],
    ["GPIO14", "14"],
    ["GPIO15", "15"],
    ["GPIO16", "16"],
    ["GPIO17", "17"],
    ["GPIO18", "18"],
    ["GPIO19", "19"],
    ["GPIO20", "20"],
    ["GPIO21", "21"],
    ["GPIO36", "36"],
    ["GPIO37", "37"],
    ["GPIO38", "38"],
    ["GPIO39", "39"],
    ["GPIO40", "40"],
    ["GPIO41", "41"],
    ["GPIO42", "42"],
    ["GPIO45", "45"],
    ["GPIO46", "46"],
    ["GPIO47", "47"],
    ["GPIO48", "48"]
  ],
  'arduino-uno': [
    ["A0", "A0"],
    ["A1", "A1"],
    ["A2", "A2"],
    ["A3", "A3"],
    ["A4", "A4"],
    ["A5", "A5"]
  ]
};

function getKY023AnalogPins() {
  var boardId = window.currentBoardId || 'esp32-s3-devkitc1';
  return KY023_ANALOG_PINS[boardId] || KY023_ANALOG_PINS['esp32-s3-devkitc1'];
}

Blockly.Blocks['ky023_init'] = {
  init: function() {
    this.setColour(30);
    this.appendDummyInput()
        .appendField("KY023 Joystick")
        .appendField(new Blockly.FieldImage("../../media/ky023jm.png", 64, 64))
        .appendField("Initialize")
        .appendField(" X-Axis")
        .appendField(new Blockly.FieldDropdown(getKY023AnalogPins), "X_PIN")
        .appendField(" Y-Axis")
        .appendField(new Blockly.FieldDropdown(getKY023AnalogPins), "Y_PIN")
        .appendField(" Button")
        .appendField(new Blockly.FieldDropdown(getKY023AnalogPins), "BUTTON_PIN");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Initialize KY023 joystick module with configurable pins');
  }
};

Blockly.Blocks['ky023_read_x'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("KY023 Joystick")
        .appendField(new Blockly.FieldImage("../../media/ky023jm.png", 64, 64))
        .appendField("Read X-Axis");
    this.setOutput(true, 'Number');
    this.setTooltip('Read X-axis value (-128 to 127). 0 = center position.');
  }
};

Blockly.Blocks['ky023_read_y'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("KY023 Joystick")
        .appendField(new Blockly.FieldImage("../../media/ky023jm.png", 64, 64))
        .appendField("Read Y-Axis");
    this.setOutput(true, 'Number');
    this.setTooltip('Read Y-axis value (-128 to 127). 0 = center position.');
  }
};

Blockly.Blocks['ky023_read_button'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("KY023 Joystick")
        .appendField(new Blockly.FieldImage("../../media/ky023jm.png", 64, 64))
        .appendField("Read Button");
    this.setOutput(true, 'Boolean');
    this.setTooltip('Read button state (true = pressed, false = not pressed)');
  }
};

Blockly.Blocks['ky023_test'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("KY023 Joystick")
        .appendField(new Blockly.FieldImage("../../media/ky023jm.png", 64, 64))
        .appendField("Test");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Test the KY023 joystick by reading and printing values to Serial');
  }
};
