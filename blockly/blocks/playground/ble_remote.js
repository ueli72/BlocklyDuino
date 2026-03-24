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
 * @fileoverview BLE Remote Control blocks.
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.ble_remote = {};

var BLE_BLOCKED_IN_CALLBACK = [
  'internal_led_init', 'internal_led_set', 'internal_led_off', 'internal_led_test',
  'base_delay', 'serial_print', 'inout_tone', 'inout_notone',
  'max98357a_init', 'max98357a_play_tone', 'max98357a_stop', 'max98357a_test',
  'max98357a_play_file', 'max98357a_is_playing', 'max98357a_wait_until_done',
  'oled_init', 'oled_write', 'oled_clear', 'oled_test',
  'sdcard_init', 'sdcard_write', 'sdcard_read', 'sdcard_append', 'sdcard_exists', 'sdcard_delete', 'sdcard_test',
  'dht11_init', 'dht11_read_temp', 'dht11_read_humidity', 'dht11_test',
  'ultrasonic_read', 'ultrasonic_test',
  'ble_remote_send'
];

function checkBLEBlocks(block) {
  if (!block || !block.workspace) return;
  var child = block.getInputTargetBlock('CALLBACK_CODE');
  var hasBlocked = false;
  while (child) {
    if (BLE_BLOCKED_IN_CALLBACK.indexOf(child.type) !== -1) {
      hasBlocked = true;
      break;
    }
    child = child.getNextBlock();
  }
  if (hasBlocked) {
    block.setWarningText('⚠️ FORBIDDEN! This block cannot be used inside BLE callback!\n\nISR restrictions:\n• No delay()\n• No Serial\n• No OLED, SD Card, DHT11, Ultrasonic\n• No MAX98357A\n• No Internal LED init\n• No BLE Send (would cause recursion)\n\nRemove this block immediately!');
    block.setColour(0);
  } else {
    block.setWarningText(null);
    block.setColour(190);
  }
}

Blockly.Blocks['ble_remote_init'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("BLE Remote")
        .appendField(new Blockly.FieldImage("../../media/ble.png", 64, 64))
        .appendField("Initialize")
        .appendField("Name:")
        .appendField(new Blockly.FieldTextInput("PlaygroundCar"), "NAME");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Initialize BLE as server. Mobile app can connect to control the car.');
  }
};

Blockly.Blocks['ble_remote_on_direction'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("BLE Remote")
        .appendField(new Blockly.FieldImage("../../media/ble.png", 64, 64))
        .appendField("On Direction");
    this.appendStatementInput("CALLBACK_CODE")
        .appendField("do");
    this.appendDummyInput()
        .appendField("  direction (-60 to +60)");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Callback when direction command received. ISR restrictions apply - no delay, no Serial, no blocking operations.');
  },
  onchange: function() {
    checkBLEBlocks(this);
  }
};

Blockly.Blocks['ble_remote_on_speed'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("BLE Remote")
        .appendField(new Blockly.FieldImage("../../media/ble.png", 64, 64))
        .appendField("On Speed");
    this.appendStatementInput("CALLBACK_CODE")
        .appendField("do");
    this.appendDummyInput()
        .appendField("  speed (0-255)");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Callback when speed command received. ISR restrictions apply - no delay, no Serial, no blocking operations.');
  },
  onchange: function() {
    checkBLEBlocks(this);
  }
};

Blockly.Blocks['ble_remote_on_command'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("BLE Remote")
        .appendField(new Blockly.FieldImage("../../media/ble.png", 64, 64))
        .appendField("On Command");
    this.appendStatementInput("CALLBACK_CODE")
        .appendField("do");
    this.appendDummyInput()
        .appendField("  command (string)");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Callback for custom commands (e.g., "light_on", "honk"). ISR restrictions apply.');
  },
  onchange: function() {
    checkBLEBlocks(this);
  }
};

Blockly.Blocks['ble_remote_send'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("BLE Remote")
        .appendField(new Blockly.FieldImage("../../media/ble.png", 64, 64))
        .appendField("Send");
    this.appendValueInput("VALUE", 'String')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("value");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Send data back to connected mobile app. Can only be used in main loop, not in BLE callbacks.');
  }
};

Blockly.Blocks['ble_remote_is_connected'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("BLE Remote")
        .appendField(new Blockly.FieldImage("../../media/ble.png", 64, 64))
        .appendField("Is Connected");
    this.setOutput(true, 'Boolean');
    this.setTooltip('Returns true if a mobile device is connected via BLE.');
  }
};

Blockly.Blocks['ble_remote_test'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("BLE Remote")
        .appendField(new Blockly.FieldImage("../../media/ble.png", 64, 64))
        .appendField("Test");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Test BLE by printing connection status and received commands to Serial.');
  }
};
