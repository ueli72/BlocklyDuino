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
 * @fileoverview KY023 Dual Joystick Module blocks for esp32-controller.
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.ky023 = {};

// Joystick selection dropdown
var KY023_JOYSTICK_OPTIONS = [
  ["JoyLeft", "LEFT"],
  ["JoyRight", "RIGHT"]
];

Blockly.Blocks['ky023_init'] = {
  init: function() {
    this.setColour(30);
    this.appendDummyInput()
        .appendField("KY023 Joystick")
        .appendField(new Blockly.FieldImage("media/ky023jm.png", 64, 64))
        .appendField("Initialize")
        .appendField(new Blockly.FieldCheckbox("TRUE"), "INIT_LEFT")
        .appendField("JoyLeft")
        .appendField(new Blockly.FieldCheckbox("TRUE"), "INIT_RIGHT")
        .appendField("JoyRight");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Initialize KY023 dual joystick module. JoyLeft: X=GPIO1, Y=GPIO2, SW=GPIO0. JoyRight: X=GPIO4, Y=GPIO5, SW=GPIO3');
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
    this.setTooltip('Test both joysticks by reading and printing values to Serial for 10 seconds each.');
  }
};
