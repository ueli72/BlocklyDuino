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
 * @fileoverview SD Card blocks.
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.sdcard = {};

Blockly.Blocks['sdcard_init'] = {
  init: function() {
    this.setColour(30);
    this.appendDummyInput()
        .appendField("SD Card")
        .appendField(new Blockly.FieldImage("../../media/sdcard.jpg", 64, 64))
        .appendField("Initialize");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Initialize the SD card module');
  }
};

Blockly.Blocks['sdcard_write'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("SD Card")
        .appendField(new Blockly.FieldImage("../../media/sdcard.jpg", 64, 64))
        .appendField("Write to");
    this.appendValueInput("PATH")
        .setCheck('String')
        .appendField("File");
    this.appendValueInput("CONTENT")
        .setCheck('String')
        .appendField("Content");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Write content to a file on the SD card');
  }
};

Blockly.Blocks['sdcard_read'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("SD Card")
        .appendField(new Blockly.FieldImage("../../media/sdcard.jpg", 64, 64))
        .appendField("Read from");
    this.appendValueInput("PATH")
        .setCheck('String')
        .appendField("File");
    this.setOutput(true, 'String');
    this.setTooltip('Read content from a file on the SD card');
  }
};

Blockly.Blocks['sdcard_append'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("SD Card")
        .appendField(new Blockly.FieldImage("../../media/sdcard.jpg", 64, 64))
        .appendField("Append to");
    this.appendValueInput("PATH")
        .setCheck('String')
        .appendField("File");
    this.appendValueInput("CONTENT")
        .setCheck('String')
        .appendField("Content");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Append content to a file on the SD card');
  }
};

Blockly.Blocks['sdcard_exists'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("SD Card")
        .appendField(new Blockly.FieldImage("../../media/sdcard.jpg", 64, 64))
        .appendField("File exists");
    this.appendValueInput("PATH")
        .setCheck('String')
        .appendField("File");
    this.setOutput(true, 'Boolean');
    this.setTooltip('Check if a file exists on the SD card');
  }
};

Blockly.Blocks['sdcard_delete'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("SD Card")
        .appendField(new Blockly.FieldImage("../../media/sdcard.jpg", 64, 64))
        .appendField("Delete");
    this.appendValueInput("PATH")
        .setCheck('String')
        .appendField("File");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Delete a file from the SD card');
  }
};

Blockly.Blocks['sdcard_test'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("SD Card")
        .appendField(new Blockly.FieldImage("../../media/sdcard.jpg", 64, 64))
        .appendField("Test");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Test the SD card module');
  }
};
