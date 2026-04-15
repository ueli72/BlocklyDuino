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
 * @fileoverview OLED Menu blocks for ESP32-Controller.
 * Universal menu that works with any array of strings.
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.menu = {};

var CONTROLLER_JOYSTICK_OPTIONS = [
  ["JoyLeft", "LEFT"],
  ["JoyRight", "RIGHT"]
];

Blockly.Blocks['oled_menu'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("OLED Menu")
        .appendField(new Blockly.FieldImage("media/oled.png", 64, 64));
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Joystick")
        .appendField(new Blockly.FieldDropdown(CONTROLLER_JOYSTICK_OPTIONS), "JOYSTICK");
    this.appendValueInput("TITLE")
        .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Title");
    this.appendValueInput("ITEMS")
        .setCheck('Array')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Items");
    this.setOutput(true, 'String');
    this.setTooltip('Show a scrollable menu on OLED. Use joystick Y-axis to scroll, button to select. Returns the selected item as string.');
  }
};
