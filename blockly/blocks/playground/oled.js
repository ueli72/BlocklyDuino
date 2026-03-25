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
 * @fileoverview OLED display blocks.
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.oled = {};

Blockly.Blocks['oled_init'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("OLED Display")
        .appendField(new Blockly.FieldImage("../../media/oled.png", 64, 64))
        .appendField("Initialize");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Initialize the OLED display');
  }
};

Blockly.Blocks['oled_write'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("OLED Display")
        .appendField(new Blockly.FieldImage("../../media/oled.png", 64, 64))
        .appendField("Write");
    this.appendValueInput("TEXT", 'String')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Text");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Write text to OLED display (use \\n for new lines)');
  }
};

Blockly.Blocks['oled_clear'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("OLED Display")
        .appendField(new Blockly.FieldImage("../../media/oled.png", 64, 64))
        .appendField("Clear");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Clear the OLED display');
  }
};

Blockly.Blocks['oled_test'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("OLED Display")
        .appendField(new Blockly.FieldImage("../../media/oled.png", 64, 64))
        .appendField("Test");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Test the OLED display');
  }
};
