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
 * @fileoverview Brightness sensor (LDR GL5546) blocks.
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.brightness = {};

function getBrightnessPins() {
  return [
    ["GPIO36 (default)", "36"],
    ["GPIO37", "37"],
    ["GPIO38", "38"],
    ["GPIO39", "39"],
    ["GPIO40", "40"],
    ["GPIO41", "41"],
    ["GPIO42", "42"],
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
    ["GPIO45", "45"],
    ["GPIO46", "46"],
    ["GPIO47", "47"],
    ["GPIO48", "48"]
  ];
}

Blockly.Blocks['brightness_read'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("Brightness")
        .appendField(new Blockly.FieldImage("media/gl5546.png", 64, 64))
        .appendField("Read")
        .appendField(new Blockly.FieldDropdown(getBrightnessPins), "PIN");
    this.setOutput(true, 'Number');
    this.setTooltip('Read brightness value (0-4095). Higher value = more light.');
  }
};
