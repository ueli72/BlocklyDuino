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

var BLOCKED_IN_TIMER = [
  'esp32_controller_led_init', 'esp32_controller_led_set',
  'base_delay', 'serial_print', 'inout_tone', 'inout_notone',
  'max98357a_init', 'max98357a_play_tone', 'max98357a_stop', 'max98357a_test',
  'max98357a_play_file', 'max98357a_is_playing', 'max98357a_wait_until_done',
  'oled_init', 'oled_write', 'oled_clear', 'oled_test',
  'sdcard_init', 'sdcard_write', 'sdcard_read', 'sdcard_append', 'sdcard_exists', 'sdcard_delete', 'sdcard_list', 'sdcard_test',
  'ultrasonic_read', 'ultrasonic_test'
];

function checkTimerBlocks(block) {
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
  
  // Check for forbidden blocks inside timer callback
  var child = block.getInputTargetBlock('HANDLER_CODE');
  var hasBlocked = false;
  while (child) {
    if (BLOCKED_IN_TIMER.indexOf(child.type) !== -1) {
      hasBlocked = true;
      break;
    }
    child = child.getNextBlock();
  }
  if (hasBlocked) {
    block.setWarningText(i18n.t('warnings.forbiddenInTimer'));
    block.setColour(0);
  } else {
    block.setWarningText(null);
    block.setColour(0);
  }
}

Blockly.Blocks['async_timer'] = {
  init: function() {
    this.setColour(0);
    this.appendDummyInput()
        .appendField(new Blockly.FieldImage("media/timer.png", 64, 64))
        .appendField("After");
    this.appendValueInput("DELAY")
        .setCheck('Number')
        .appendField("ms");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown(getTimerModes), "MODE");
    this.appendStatementInput("HANDLER_CODE")
        .appendField("do");
    this.setPreviousStatement(true, "interrupts");
    this.setNextStatement(true, "interrupts");
    this.setTooltip('Timer callback runs in interrupt context. No delay(), no Serial, no OLED/SD/DHT11/Ultrasonic/MAX98357A/WS2812. Use volatile for variables shared with main loop.');
    this.setInputsInline(true);
  },
  onchange: function() {
    checkTimerBlocks(this);
  }
};
