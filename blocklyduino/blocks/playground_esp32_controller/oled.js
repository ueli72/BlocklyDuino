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
 * @fileoverview OLED display blocks for ESP32-C3 0.42 OLED board.
 * 72x40 pixel display on I2C (GPIO5/6).
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.oled = {};

Blockly.Blocks['oled_init'] = {
  init: function() {
    this.setColour(30);
    this.appendDummyInput()
        .appendField("OLED Display")
        .appendField(new Blockly.FieldImage("media/oled.png", 64, 64))
        .appendField("Initialize");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Initialize the 0.42" OLED display (72x40)');
  }
};

Blockly.Blocks['oled_write'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("OLED Display")
        .appendField(new Blockly.FieldImage("media/oled.png", 64, 64))
        .appendField("Write");
    this.appendValueInput("TEXT", 'String')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Text");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Write text to OLED display (72x40 pixels)');
  }
};

Blockly.Blocks['oled_clear'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("OLED Display")
        .appendField(new Blockly.FieldImage("media/oled.png", 64, 64))
        .appendField("Clear");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Clear the OLED display');
  }
};

Blockly.Blocks['oled_set_cursor'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("OLED Display")
        .appendField(new Blockly.FieldImage("media/oled.png", 64, 64))
        .appendField("Set Cursor");
    this.appendValueInput("X", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("X (0-71)");
    this.appendValueInput("Y", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Y (0-39)");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Set cursor position for text (0-71, 0-39)');
  }
};
