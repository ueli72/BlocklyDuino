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
 * @fileoverview Internal LED blocks for ESP32-C3 0.42 OLED board.
 * Simple on/off LED on GPIO8 (active LOW).
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.internal_led = {};

Blockly.Blocks['esp32_controller_led_init'] = {
  init: function() {
    this.setColour(30);
    this.appendDummyInput()
        .appendField("Internal LED")
        .appendField(new Blockly.FieldImage("media/internalled.png", 64, 64))
        .appendField("Initialize");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Initialize the built-in LED on GPIO8');
  }
};

Blockly.Blocks['esp32_controller_led_set'] = {
  init: function() {
    this.setColour(30);
    this.appendDummyInput()
        .appendField("Internal LED")
        .appendField(new Blockly.FieldImage("media/internalled.png", 64, 64))
        .appendField(new Blockly.FieldDropdown([["ON", "ON"], ["OFF", "OFF"]]), "STATE");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Turn the built-in LED on or off (GPIO8)');
  }
};
