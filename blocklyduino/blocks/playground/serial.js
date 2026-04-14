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
 * @fileoverview Serial communication blocks.
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.serial = {};

function getBaudRates() {
  return [
    ["9600", "9600"],
    ["19200", "19200"],
    ["38400", "38400"],
    ["57600", "57600"],
    ["115200", "115200"],
    ["230400", "230400"],
    ["460800", "460800"],
    ["921600", "921600"]
  ];
}

Blockly.Blocks['serial_init'] = {
  init: function() {
    this.setColour(30);
    this.appendDummyInput()
        .appendField("Serial")
        .appendField(new Blockly.FieldImage("media/cli.png", 64, 64))
        .appendField("Initialize")
        .appendField(new Blockly.FieldDropdown(getBaudRates), "BAUD");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Initialize serial communication with selected baud rate');
  }
};

Blockly.Blocks['serial_print'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("Serial")
        .appendField(new Blockly.FieldImage("media/cli.png", 64, 64))
        .appendField("Print");
    this.appendValueInput("TEXT")
        .setCheck(null)
        .appendField("text");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Print text to serial without newline');
  }
};

Blockly.Blocks['serial_println'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("Serial")
        .appendField(new Blockly.FieldImage("media/cli.png", 64, 64))
        .appendField("Print Line");
    this.appendValueInput("TEXT")
        .setCheck(null)
        .appendField("text");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Print text to serial with newline');
  }
};

Blockly.Blocks['serial_read_char'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("Serial")
        .appendField(new Blockly.FieldImage("media/cli.png", 64, 64))
        .appendField("Read Char")
        .appendField(new Blockly.FieldDropdown([
            ["Non-blocking (immediate)", "false"],
            ["Blocking (wait for input)", "true"]
        ]), "BLOCKING");
    this.setOutput(true, 'String');
    this.setTooltip('Read a single character. Non-blocking returns empty if no data, blocking waits for input.');
  }
};

Blockly.Blocks['serial_read_line'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("Serial")
        .appendField(new Blockly.FieldImage("media/cli.png", 64, 64))
        .appendField("Read Line");
    this.setOutput(true, 'String');
    this.setTooltip('Read a line until CR or LF. Returns trimmed string without whitespace.');
  }
};

Blockly.Blocks['serial_available'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("Serial")
        .appendField(new Blockly.FieldImage("media/cli.png", 64, 64))
        .appendField("Available");
    this.setOutput(true, 'Number');
    this.setTooltip('Returns number of bytes available to read');
  }
};

Blockly.Blocks['serial_print_array'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("Serial")
        .appendField(new Blockly.FieldImage("media/cli.png", 64, 64))
        .appendField("Print Array");
    this.appendValueInput("ARRAY")
        .setCheck('Array')
        .appendField("array");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Print each array element on a new line');
  }
};
