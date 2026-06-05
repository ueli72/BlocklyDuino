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
 * @fileoverview KY023 Dual Joystick Module blocks for playground_controller.
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.ky023 = {};

// Joystick selection dropdown
var KY023_JOYSTICK_OPTIONS = [
  ["JoyLeft", "LEFT"],
  ["JoyRight", "RIGHT"]
];

// Available pins for playground_controller (ESP32-C3)
var KY023_ANALOG_PINS = {
  'playground_controller': [
    ["GPIO0", "0"],
    ["GPIO1", "1"],
    ["GPIO2", "2"],
    ["GPIO3", "3"],
    ["GPIO4", "4"],
    ["GPIO7", "7"],
    ["GPIO8", "8"],
    ["GPIO10", "10"],
    ["GPIO20", "20"],
    ["GPIO21", "21"]
  ]
};

KY023_ANALOG_PINS['esp32-controller'] = KY023_ANALOG_PINS['playground_controller'];

function getKY023ControllerPins() {
  var boardId = window.currentBoardId || 'playground_controller';
  return KY023_ANALOG_PINS[boardId] || KY023_ANALOG_PINS['playground_controller'];
}

Blockly.Blocks['ky023_init'] = {
  init: function() {
    this.setColour(30);
    this.appendDummyInput()
        .appendField("KY023 Joystick")
        .appendField(new Blockly.FieldImage("media/ky023jm.png", 64, 64))
        .appendField("Initialize");
    // JoyLeft section
    this.appendDummyInput()
        .appendField(new Blockly.FieldCheckbox("TRUE"), "INIT_LEFT")
        .appendField("JoyLeft")
        .appendField("X:")
        .appendField(new Blockly.FieldDropdown(getKY023ControllerPins), "LEFT_X_PIN")
        .appendField("Y:")
        .appendField(new Blockly.FieldDropdown(getKY023ControllerPins), "LEFT_Y_PIN")
        .appendField("Btn:")
        .appendField(new Blockly.FieldDropdown(getKY023ControllerPins), "LEFT_BTN_PIN");
    // JoyRight section
    this.appendDummyInput()
        .appendField(new Blockly.FieldCheckbox("TRUE"), "INIT_RIGHT")
        .appendField("JoyRight")
        .appendField("X:")
        .appendField(new Blockly.FieldDropdown(getKY023ControllerPins), "RIGHT_X_PIN")
        .appendField("Y:")
        .appendField(new Blockly.FieldDropdown(getKY023ControllerPins), "RIGHT_Y_PIN")
        .appendField("Btn:")
        .appendField(new Blockly.FieldDropdown(getKY023ControllerPins), "RIGHT_BTN_PIN");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Initialize KY023 dual joystick module with selectable pins. Defaults: JoyLeft (X=GPIO1, Y=GPIO2, Btn=GPIO0), JoyRight (X=GPIO4, Y=GPIO10, Btn=GPIO3)');
  }
};

Blockly.Blocks['ky023_read_x'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("KY023 Joystick")
        .appendField(new Blockly.FieldImage("media/ky023jm.png", 64, 64))
        .appendField("Read X-Axis")
        .appendField(new Blockly.FieldDropdown(KY023_JOYSTICK_OPTIONS), "JOYSTICK");
    this.setOutput(true, 'Number');
    this.setTooltip('Read X-axis value (0-4095) from selected joystick. Center is ~2000.');
  }
};

Blockly.Blocks['ky023_read_y'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("KY023 Joystick")
        .appendField(new Blockly.FieldImage("media/ky023jm.png", 64, 64))
        .appendField("Read Y-Axis")
        .appendField(new Blockly.FieldDropdown(KY023_JOYSTICK_OPTIONS), "JOYSTICK");
    this.setOutput(true, 'Number');
    this.setTooltip('Read Y-axis value (0-4095) from selected joystick. Center is ~2000.');
  }
};

Blockly.Blocks['ky023_read_button'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("KY023 Joystick")
        .appendField(new Blockly.FieldImage("media/ky023jm.png", 64, 64))
        .appendField("Switch Pressed")
        .appendField(new Blockly.FieldDropdown(KY023_JOYSTICK_OPTIONS), "JOYSTICK");
    this.setOutput(true, 'Boolean');
    this.setTooltip('Check if joystick button is pressed (returns true when pressed, false when released). Button is active LOW.');
  }
};

Blockly.Blocks['ky023_test'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("KY023 Joystick")
        .appendField(new Blockly.FieldImage("media/ky023jm.png", 64, 64))
        .appendField("Test");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Test both joysticks by reading values and displaying on OLED.');
  }
};
