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
 * @fileoverview Timer blocks for async execution.
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.timer = {};

function getTimerModes() {
  return [
    ["once", "once"],
    ["repeated", "repeated"]
  ];
}

Blockly.Blocks['async_timer'] = {
  init: function() {
    this.setColour(120);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("../../media/timer.png", 64, 64))
        .appendField("After");
    this.appendValueInput("DELAY")
        .setCheck('Number')
        .appendField("ms");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(getTimerModes), "MODE");
    this.appendStatementInput("HANDLER_CODE")
        .appendField("do");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Execute code after delay. Non-blocking, runs in parallel with main loop.');
    this.setInputsInline(true);
  }
};
