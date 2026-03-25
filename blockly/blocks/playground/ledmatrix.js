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
 * @fileoverview LED Matrix blocks.
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.ledmatrix = {};

Blockly.Blocks['led_matrix_init'] = {
  init: function() {
    this.setColour(30);
    this.appendDummyInput()
        .appendField("LED Matrix")
        .appendField(new Blockly.FieldImage("../../media/ledmatrix.jpg", 64, 64))
        .appendField("Initialize");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Initialize the 4x4 LED Matrix');
  }
};

Blockly.Blocks['led_matrix_set_pixel'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("LED Matrix")
        .appendField(new Blockly.FieldImage("../../media/ledmatrix.jpg", 64, 64))
        .appendField("Set Pixel");
    this.appendValueInput("INDEX", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Index (0-15)");
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
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Set a single pixel color (0-15)');
  }
};

Blockly.Blocks['led_matrix_fill'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("LED Matrix")
        .appendField(new Blockly.FieldImage("../../media/ledmatrix.jpg", 64, 64))
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
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Fill all LEDs with a specific color');
  }
};

Blockly.Blocks['led_matrix_show'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("LED Matrix")
        .appendField(new Blockly.FieldImage("../../media/ledmatrix.jpg", 64, 64))
        .appendField("Show");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Show the changes on the LED Matrix');
  }
};

Blockly.Blocks['led_matrix_off'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("LED Matrix")
        .appendField(new Blockly.FieldImage("../../media/ledmatrix.jpg", 64, 64))
        .appendField("Turn Off");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Turn off all LEDs on the Matrix');
  }
};

Blockly.Blocks['led_matrix_test'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("LED Matrix")
        .appendField(new Blockly.FieldImage("../../media/ledmatrix.jpg", 64, 64))
        .appendField("Test Rainbow");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Test the LED Matrix with a rainbow effect');
  }
};
