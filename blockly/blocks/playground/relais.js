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
 * @fileoverview Relais blocks.
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.relais = {};

Blockly.Blocks['relais_set'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("Relais")
        .appendField(new Blockly.FieldImage("../../media/relais.jpg", 64, 64))
        .appendField("Relay#")
        .appendField(new Blockly.FieldDropdown([["Relay1", "1"], ["Relay2", "2"]]), "RELAY")
        .appendField("State")
        .appendField(new Blockly.FieldDropdown([["ON", "true"], ["OFF", "false"]]), "STATE");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Set relay state ON or OFF');
  }
};

Blockly.Blocks['relais_test'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("Relais")
        .appendField(new Blockly.FieldImage("../../media/relais.jpg", 64, 64))
        .appendField("Test");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Test the relais');
  }
};
