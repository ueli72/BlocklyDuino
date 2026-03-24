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
 * @fileoverview WS2812 LED Strip blocks.
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.ws2812 = {};

function getWS2812Pins() {
  return [
    ["GPIO11 (default)", "11"],
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
  ];
}

Blockly.Blocks['ws2812_init'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("WS2812 Strip")
        .appendField(new Blockly.FieldImage("../../media/ws2812strip.png", 64, 64))
        .appendField("Initialize")
        .appendField(new Blockly.FieldDropdown(getWS2812Pins), "PIN");
    this.appendValueInput("COUNT", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("LED Count");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Initialize WS2812 LED strip');
  }
};

Blockly.Blocks['ws2812_set_pixel'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("WS2812 Strip")
        .appendField(new Blockly.FieldImage("../../media/ws2812strip.png", 64, 64))
        .appendField("Set Pixel");
    this.appendValueInput("INDEX", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Index");
    this.appendValueInput("RED", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Red (0-255)");
    this.appendValueInput("GREEN", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Green (0-255)");
    this.appendValueInput("BLUE", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Blue (0-255)");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Set a single LED color');
  }
};

Blockly.Blocks['ws2812_fill'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("WS2812 Strip")
        .appendField(new Blockly.FieldImage("../../media/ws2812strip.png", 64, 64))
        .appendField("Fill All");
    this.appendValueInput("RED", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Red (0-255)");
    this.appendValueInput("GREEN", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Green (0-255)");
    this.appendValueInput("BLUE", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Blue (0-255)");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Fill all LEDs with a specific color');
  }
};

Blockly.Blocks['ws2812_show'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("WS2812 Strip")
        .appendField(new Blockly.FieldImage("../../media/ws2812strip.png", 64, 64))
        .appendField("Show");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Update the LED strip to show changes');
  }
};

Blockly.Blocks['ws2812_off'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("WS2812 Strip")
        .appendField(new Blockly.FieldImage("../../media/ws2812strip.png", 64, 64))
        .appendField("Turn Off");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Turn off all LEDs');
  }
};

Blockly.Blocks['ws2812_test'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("WS2812 Strip")
        .appendField(new Blockly.FieldImage("../../media/ws2812strip.png", 64, 64))
        .appendField("Test");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Test the WS2812 strip with a rainbow effect');
  }
};
