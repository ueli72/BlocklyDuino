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

function isInInterruptsBlock(block) {
  if (!block) return false;
  var parent = block.getParent();
  while (parent) {
    if (parent.type === 'arduino_interrupts') {
      return true;
    }
    parent = parent.getParent();
  }
  return false;
}

function isDuplicateBLEBlock(block) {
  if (!block || !block.workspace) return false;
  var blocks = block.workspace.getAllBlocks();
  var count = 0;
  for (var i = 0; i < blocks.length; i++) {
    if (blocks[i].type === block.type && blocks[i].id !== block.id) {
      count++;
    }
  }
  return count > 0;
}

function checkBLEBlocks(block) {
  if (!block || !block.workspace) return;
  
  if (isDuplicateBLEBlock(block)) {
    block.setWarningText('⚠️ This block can only be used ONCE!\n\nRemove the duplicate block.');
    block.setColour(0);
    return;
  }
  
  if (!isInInterruptsBlock(block)) {
    block.setWarningText('⚠️ This block must be placed inside the Interrupts block!\n\nDrag this block into the Interrupts block to use it properly.');
    block.setColour(0);
    return;
  }
  
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
    block.setWarningText('⚠️ FORBIDDEN! This block cannot be used inside BLE callback!\n\nISR restrictions:\n• No delay()\n• No Serial\n• No OLED, SD Card, DHT11, Ultrasonic\n• No MAX98357A\n• No Internal LED, LED Matrix (WS2812)\n• No BLE Send (would cause recursion)\n\nRemove this block immediately!');
    block.setColour(0);
  } else {
    block.setWarningText(null);
    block.setColour(0);
  }
}

Blockly.Blocks['ble_remote_init'] = {
  init: function() {
    this.setColour(30);
    this.appendDummyInput()
        .appendField("BLE Remote")
        .appendField(new Blockly.FieldImage("media/ble.png", 64, 64))
        .appendField("Initialize")
        .appendField("Name:")
        .appendField(new Blockly.FieldTextInput("PlaygroundCar"), "NAME");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Initialize BLE as server. Mobile app can connect to control the car.');
  }
};

Blockly.Blocks['ble_remote_on_direction'] = {
  init: function() {
    this.setColour(0);
    this.appendDummyInput()
        .appendField("BLE Remote")
        .appendField(new Blockly.FieldImage("media/ble.png", 64, 64))
        .appendField("On Direction");
    this.appendValueInput("DIRECTION")
        .setCheck('Number')
        .appendField("direction");
    this.appendStatementInput("CALLBACK_CODE")
        .appendField("do");
    this.setPreviousStatement(true, "interrupts");
    this.setNextStatement(true, "interrupts");
    this.setTooltip('Place in Interrupts block. Callback when direction command received. Drag the direction value to use it. ISR restrictions apply.');
  },
  onchange: function(event) {
    checkBLEBlocks(this);
    if (!this.workspace) return;
    var directionInput = this.getInput('DIRECTION');
    if (directionInput && directionInput.connection && !directionInput.connection.targetConnection) {
      var block = this;
      setTimeout(function() {
        if (directionInput.connection && !directionInput.connection.targetConnection) {
          try {
            var newBlock = Blockly.Block.obtain(block.workspace, 'ble_remote_direction_value');
            newBlock.initSvg();
            newBlock.render();
            directionInput.connection.connect(newBlock.outputConnection);
          } catch(e) {}
        }
      }, 10);
    }
  }
};

Blockly.Blocks['ble_remote_on_speed'] = {
  init: function() {
    this.setColour(0);
    this.appendDummyInput()
        .appendField("BLE Remote")
        .appendField(new Blockly.FieldImage("media/ble.png", 64, 64))
        .appendField("On Speed");
    this.appendValueInput("SPEED")
        .setCheck('Number')
        .appendField("speed");
    this.appendStatementInput("CALLBACK_CODE")
        .appendField("do");
    this.setPreviousStatement(true, "interrupts");
    this.setNextStatement(true, "interrupts");
    this.setTooltip('Place in Interrupts block. Callback when speed command received. Drag the speed value to use it. ISR restrictions apply.');
  },
  onchange: function(event) {
    checkBLEBlocks(this);
    if (!this.workspace) return;
    var speedInput = this.getInput('SPEED');
    if (speedInput && speedInput.connection && !speedInput.connection.targetConnection) {
      var block = this;
      setTimeout(function() {
        if (speedInput.connection && !speedInput.connection.targetConnection) {
          try {
            var newBlock = Blockly.Block.obtain(block.workspace, 'ble_remote_speed_value');
            newBlock.initSvg();
            newBlock.render();
            speedInput.connection.connect(newBlock.outputConnection);
          } catch(e) {}
        }
      }, 10);
    }
  }
};

Blockly.Blocks['ble_remote_on_command'] = {
  init: function() {
    this.setColour(0);
    this.appendDummyInput()
        .appendField("BLE Remote")
        .appendField(new Blockly.FieldImage("media/ble.png", 64, 64))
        .appendField("On Command");
    this.appendValueInput("COMMAND")
        .setCheck('Number')
        .appendField("command");
    this.appendStatementInput("CALLBACK_CODE")
        .appendField("do");
    this.setPreviousStatement(true, "interrupts");
    this.setNextStatement(true, "interrupts");
    this.setTooltip('Place in Interrupts block. Callback for custom commands (0-255). Drag the command value to use it. ISR restrictions apply.');
  },
  onchange: function(event) {
    checkBLEBlocks(this);
    if (!this.workspace) return;
    var commandInput = this.getInput('COMMAND');
    if (commandInput && commandInput.connection && !commandInput.connection.targetConnection) {
      var block = this;
      setTimeout(function() {
        if (commandInput.connection && !commandInput.connection.targetConnection) {
          try {
            var newBlock = Blockly.Block.obtain(block.workspace, 'ble_remote_command_value');
            newBlock.initSvg();
            newBlock.render();
            commandInput.connection.connect(newBlock.outputConnection);
          } catch(e) {}
        }
      }, 10);
    }
  }
};

Blockly.Blocks['ble_remote_direction_value'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("BLE Direction")
        .appendField(new Blockly.FieldImage("media/ble.png", 40, 40))
        .appendField("Value");
    this.setOutput(true, 'Number');
    this.setTooltip('Returns the direction value (-60 to +60). Only valid inside "On Direction" callback.');
  }
};

Blockly.Blocks['ble_remote_speed_value'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("BLE Speed")
        .appendField(new Blockly.FieldImage("media/ble.png", 40, 40))
        .appendField("Value");
    this.setOutput(true, 'Number');
    this.setTooltip('Returns the speed value (0-255). Only valid inside "On Speed" callback.');
  }
};

Blockly.Blocks['ble_remote_command_value'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("BLE Command")
        .appendField(new Blockly.FieldImage("media/ble.png", 40, 40))
        .appendField("Value");
    this.setOutput(true, 'Number');
    this.setTooltip('Returns the command value (0-255). Only valid inside "On Command" callback.');
  }
};

Blockly.Blocks['ble_remote_send'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("BLE Remote")
        .appendField(new Blockly.FieldImage("media/ble.png", 64, 64))
        .appendField("Send");
    this.appendValueInput("VALUE", 'String')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("value");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Send data back to connected mobile app. Can only be used in main loop, not in BLE callbacks.');
  }
};

Blockly.Blocks['ble_remote_is_connected'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("BLE Remote")
        .appendField(new Blockly.FieldImage("media/ble.png", 64, 64))
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
        .appendField(new Blockly.FieldImage("media/ble.png", 64, 64))
        .appendField("Test");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Test BLE by printing connection status and received commands to Serial.');
  }
};
