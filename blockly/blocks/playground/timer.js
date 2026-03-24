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
  'internal_led_init', 'internal_led_set', 'internal_led_off', 'internal_led_test',
  'base_delay', 'serial_print', 'inout_tone', 'inout_notone',
  'max98357a_init', 'max98357a_play_tone', 'max98357a_stop', 'max98357a_test',
  'max98357a_play_file', 'max98357a_is_playing', 'max98357a_wait_until_done',
  'oled_init', 'oled_write', 'oled_clear', 'oled_test',
  'sdcard_init', 'sdcard_write', 'sdcard_read', 'sdcard_append', 'sdcard_exists', 'sdcard_delete', 'sdcard_test',
  'dht11_init', 'dht11_read_temp', 'dht11_read_humidity', 'dht11_test',
  'ultrasonic_read', 'ultrasonic_test'
];

function checkTimerBlocks(block) {
  if (!block || !block.workspace) return;
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
    block.setWarningText('⚠️ FORBIDDEN! This block cannot be used inside a timer callback!\n\nTimer restrictions:\n• No delay()\n• No Serial\n• No OLED, SD Card, DHT11, Ultrasonic\n• No MAX98357A\n• No Internal LED\n\nRemove this block immediately!');
    block.setColour(0);
  } else {
    block.setWarningText(null);
    block.setColour(120);
  }
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
    this.setTooltip('Timer callback runs in interrupt context. No delay(), no Serial, keep short! Use volatile for variables shared with main loop.');
    this.setInputsInline(true);
  },
  onchange: function() {
    checkTimerBlocks(this);
  }
};
