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
 * @fileoverview Internal LED blocks.
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.internal_led = {};

Blockly.Blocks['internal_led_init'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("Internal LED")
        .appendField(new Blockly.FieldImage("../../media/internalled.png", 64, 64))
        .appendField("Initialize");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Initialize the internal RGB LED');
  }
};

Blockly.Blocks['internal_led_set'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("Internal LED")
        .appendField(new Blockly.FieldImage("../../media/internalled.png", 64, 64))
        .appendField("Set Color");
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
    this.setTooltip('Set the internal RGB LED color');
  }
};

Blockly.Blocks['internal_led_off'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("Internal LED")
        .appendField(new Blockly.FieldImage("../../media/internalled.png", 64, 64))
        .appendField("Turn Off");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Turn off the internal RGB LED');
  }
};
