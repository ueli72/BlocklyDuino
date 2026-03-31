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
 * @fileoverview Constants blocks (true/false).
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.constants = {};

Blockly.Blocks['constants_true'] = {
  init: function() {
    this.setColour(210);
    this.appendDummyInput()
        .appendField("true");
    this.setOutput(true, 'Boolean');
    this.setTooltip('Returns true');
  }
};

Blockly.Blocks['constants_false'] = {
  init: function() {
    this.setColour(210);
    this.appendDummyInput()
        .appendField("false");
    this.setOutput(true, 'Boolean');
    this.setTooltip('Returns false');
  }
};

Blockly.Blocks['constants_pi'] = {
  init: function() {
    this.setColour(230);
    this.appendDummyInput()
        .appendField("π");
    this.setOutput(true, 'Number');
    this.setTooltip('Pi (π) ≈ 3.14159');
  }
};

Blockly.Blocks['constants_sqrt2'] = {
  init: function() {
    this.setColour(230);
    this.appendDummyInput()
        .appendField("√2");
    this.setOutput(true, 'Number');
    this.setTooltip('Square root of 2 ≈ 1.41421');
  }
};

Blockly.Blocks['constants_sqrt3'] = {
  init: function() {
    this.setColour(230);
    this.appendDummyInput()
        .appendField("√3");
    this.setOutput(true, 'Number');
    this.setTooltip('Square root of 3 ≈ 1.73205');
  }
};

Blockly.Blocks['constants_e'] = {
  init: function() {
    this.setColour(230);
    this.appendDummyInput()
        .appendField("e");
    this.setOutput(true, 'Number');
    this.setTooltip('Euler\'s number (e) ≈ 2.71828');
  }
};

Blockly.Blocks['constants_golden_ratio'] = {
  init: function() {
    this.setColour(230);
    this.appendDummyInput()
        .appendField("φ");
    this.setOutput(true, 'Number');
    this.setTooltip('Golden ratio (φ) ≈ 1.61803');
  }
};
