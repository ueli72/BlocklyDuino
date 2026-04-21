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
 * @fileoverview Button blocks.
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.button = {};

function getButtonPins() {
  return [
    ["Button1 (GPIO1)", "1"],
    ["Button2 (GPIO2)", "2"]
  ];
}

Blockly.Blocks['button_init'] = {
  init: function() {
    this.setColour(30);
    this.appendDummyInput()
        .appendField("Button")
        .appendField(new Blockly.FieldImage("media/button.png", 64, 64))
        .appendField("Initialize");
    this.appendDummyInput("BUTTONS")
        .appendField("SW1")
        .appendField(new Blockly.FieldCheckbox("TRUE"), "SW1")
        .appendField("  SW2")
        .appendField(new Blockly.FieldCheckbox("TRUE"), "SW2");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Initialize selected buttons');
  }
};

Blockly.Blocks['button_read'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("Button")
        .appendField(new Blockly.FieldImage("media/button.png", 64, 64))
        .appendField("Read")
        .appendField(new Blockly.FieldDropdown(getButtonPins), "PIN");
    this.setOutput(true, 'Boolean');
    this.setTooltip('Read button state (true = pressed, false = not pressed)');
  }
};

Blockly.Blocks['button_test'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("Button")
        .appendField(new Blockly.FieldImage("media/button.png", 64, 64))
        .appendField("Test");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Test all buttons sequentially. Displays instructions on Serial Monitor.');
  }
};

function getInterruptPins() {
  if (typeof getCurrentBoardInterruptPinOptions === 'function') {
    var options = getCurrentBoardInterruptPinOptions();
    if (options && options.length > 0) {
      return options;
    }
  }
  var pins = getButtonPins();
  for (var i = 0; i <= 48; i++) {
    if (i !== 1 && i !== 2) {
      pins.push(["GPIO" + i, String(i)]);
    }
  }
  return pins;
}

function getInterruptModes() {
  return [
    ["FALLING (press)", "FALLING"],
    ["RISING (release)", "RISING"],
    ["CHANGE", "CHANGE"]
  ];
}

var BLOCKED_IN_ISR = [
  'internal_led_init', 'internal_led_set', 'internal_led_off', 'internal_led_test',
  'base_delay', 'serial_print', 'inout_tone', 'inout_notone',
  'max98357a_init', 'max98357a_play_tone', 'max98357a_stop', 'max98357a_test',
  'max98357a_play_file', 'max98357a_is_playing', 'max98357a_wait_until_done',
  'oled_init', 'oled_write', 'oled_clear', 'oled_test',
  'sdcard_init', 'sdcard_write', 'sdcard_read', 'sdcard_append', 'sdcard_exists', 'sdcard_delete', 'sdcard_list', 'sdcard_test',
  'ultrasonic_read', 'ultrasonic_test'
];

function checkISRBlocks(block) {
  if (!block || !block.workspace) return;
  
  // Check if inside Interrupts block
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
  
  // Check for forbidden blocks inside ISR
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
    this.setTooltip('ISR: No delay(), no Serial, keep short! Use volatile variables for data shared with main loop.');
  },
  onchange: function() {
    checkISRBlocks(this);
  }
};
