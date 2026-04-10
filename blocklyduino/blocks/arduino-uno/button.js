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
 * @fileoverview Button/Interrupt blocks for Arduino Uno.
 * Note: Arduino Uno has no built-in buttons, so only external_interrupt is provided.
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};

function getInterruptPins() {
  if (typeof getCurrentBoardInterruptPinOptions === 'function') {
    var options = getCurrentBoardInterruptPinOptions();
    if (options && options.length > 0) {
      return options;
    }
  }
  return [["D2", "2"], ["D3", "3"]];
}

function getInterruptModes() {
  return [
    ["FALLING (press)", "FALLING"],
    ["RISING (release)", "RISING"],
    ["CHANGE", "CHANGE"]
  ];
}

var BLOCKED_IN_ISR = [
  'base_delay', 'serial_print', 'inout_tone', 'inout_notone'
];

function checkISRBlocks(block) {
  if (!block || !block.workspace) return;
  
  var parent = block.getParent();
  var isInInterruptsBlock = false;
  while (parent) {
    if (parent.type === 'arduino_interrupts') {
      isInInterruptsBlock = true;
      break;
    }
    parent = parent.getParent();
  }
  
  if (!isInInterruptsBlock) {
    block.setWarningText(i18n.t('warnings.mustBeInInterrupts'));
    block.setColour(0);
    return;
  }
  
  var child = block.getInputTargetBlock('HANDLER_CODE');
  var hasBlocked = false;
  while (child) {
    if (BLOCKED_IN_ISR.indexOf(child.type) !== -1) {
      hasBlocked = true;
      break;
    }
    child = child.getNextBlock();
  }
  if (hasBlocked) {
    block.setWarningText(i18n.t('warnings.forbiddenInISR'));
    block.setColour(0);
  } else {
    block.setWarningText(null);
    block.setColour(0);
  }
  
  // Check for pin-specific warnings
  var pin = block.getFieldValue('PIN');
  var boardId = typeof selectedBoard === 'string' ? selectedBoard : (typeof localStorage !== 'undefined' ? localStorage.getItem('blocklyduino_board') : null);
  if (typeof getPinWarning === 'function') {
    var pinWarning = getPinWarning(boardId, pin);
    if (pinWarning) {
      var warningKey = boardId + '_' + pin;
      if (typeof seenPinWarnings !== 'undefined' && !seenPinWarnings.has(warningKey)) {
        seenPinWarnings.add(warningKey);
        if (typeof showBlockInfoModal === 'function') {
          showBlockInfoModal(i18n.t(pinWarning.title), i18n.t(pinWarning.message));
        }
      }
    }
  }
}

Blockly.Blocks['external_interrupt'] = {
  init: function() {
    this.setColour(0);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("media/trigger.png", 64, 64))
        .appendField("On Interrupt")
        .appendField(new Blockly.FieldDropdown(getInterruptPins), "PIN")
        .appendField(new Blockly.FieldDropdown(getInterruptModes), "MODE");
    this.appendStatementInput("HANDLER_CODE")
        .appendField("do");
    this.setPreviousStatement(true, "interrupts");
    this.setNextStatement(true, "interrupts");
    this.setTooltip('ISR: No delay(), no Serial, keep short! Use volatile variables for data shared with main loop. Arduino Uno only supports interrupts on D2 and D3.');
  },
  onchange: function() {
    checkISRBlocks(this);
  }
};
