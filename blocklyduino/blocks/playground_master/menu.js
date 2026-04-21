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
 * @fileoverview OLED Menu blocks for ESP32-S3-DevKitC-1.
 * Universal menu that works with any array of strings.
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.menu = {};

var MENU_GPIO_OPTIONS = [
  ["GPIO0", "0"],
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
  ["GPIO35", "35"],
  ["GPIO37", "37"],
  ["GPIO38", "38"],
  ["GPIO39", "39"],
  ["GPIO40", "40"],
  ["GPIO41", "41"],
  ["GPIO42", "42"],
  ["GPIO43", "43"],
  ["GPIO44", "44"],
  ["GPIO45", "45"],
  ["GPIO47", "47"],
  ["GPIO48", "48"]
];

Blockly.Blocks['oled_menu'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("OLED Menu")
        .appendField(new Blockly.FieldImage("media/oled.png", 64, 64));
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Y-Pin (scroll)")
        .appendField(new Blockly.FieldDropdown(MENU_GPIO_OPTIONS), "Y_PIN");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Btn-Pin (select)")
        .appendField(new Blockly.FieldDropdown(MENU_GPIO_OPTIONS), "BUTTON_PIN");
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
