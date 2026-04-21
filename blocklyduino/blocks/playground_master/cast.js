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
 * @fileoverview Cast blocks for type conversion.
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.cast = {};

Blockly.Blocks['variable_cast'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("Cast to")
        .appendField(new Blockly.FieldDropdown([
          ["int", "int"],
          ["long", "long"],
          ["float", "float"],
          ["byte", "byte"],
          ["bool", "bool"],
          ["char", "char"]
        ]), "TYPE");
    this.appendValueInput("VALUE")
        .setCheck(null)
        .appendField("value");
    this.setOutput(true, null);
    this.setInputsInline(true);
    this.setTooltip('Convert a value to a different type.');
  }
};

Blockly.Blocks['byte_to_array'] = {
  init: function() {
    this.setColour(190);
    this.appendValueInput("BYTE")
        .setCheck(null)
        .appendField("Byte to Array");
    this.setOutput(true, 'Array');
    this.setTooltip('Cast a byte or int to uint8_t and put it into a vector array. Returns std::vector<uint8_t>.');
  }
};
