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
 * @fileoverview Setup and Loop container blocks.
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.program_structure = {};

Blockly.Blocks['arduino_setup'] = {
  init: function() {
    this.setColour(210);
    this.appendDummyInput()
        .appendField("Setup");
    this.appendStatementInput("SETUP_CODE")
        .setCheck(["setup", "general"]);
    this.setDeletable(false);
    this.setTooltip('Code here runs once at startup');
  }
};

Blockly.Blocks['arduino_loop'] = {
  init: function() {
    this.setColour(120);
    this.appendDummyInput()
        .appendField("Loop");
    this.appendStatementInput("LOOP_CODE")
        .setCheck(["loop", "general"]);
    this.setDeletable(false);
    this.setTooltip('Code here runs repeatedly');
  }
};

Blockly.Blocks['arduino_header'] = {
  init: function() {
    this.setColour(300);
    this.appendDummyInput()
        .appendField("Header");
    this.appendStatementInput("HEADER_CODE")
        .setCheck("header");
    this.setDeletable(false);
    this.setTooltip('Code here is placed at the top of the file (includes, defines, global variables)');
  }
};
