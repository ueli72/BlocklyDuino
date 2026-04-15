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
 * @fileoverview BLE Client blocks for ESP32.
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.ble_client = {};

Blockly.Blocks['ble_client_init'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("BLE Client")
        .appendField(new Blockly.FieldImage("media/ble.png", 64, 64))
        .appendField("Initialize");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Initialize BLE client. ESP32 will act as a BLE client that can connect to other BLE devices.');
  }
};

Blockly.Blocks['ble_client_scan'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("BLE Client")
        .appendField(new Blockly.FieldImage("media/ble.png", 64, 64))
        .appendField("Scan");
    this.appendValueInput("DURATION")
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("duration (ms)");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(new Blockly.FieldCheckbox("FALSE"), "SHOW_OLED")
        .appendField("show on OLED");
    this.setOutput(true, 'Array');
    this.setTooltip('Scan for nearby BLE devices. Returns an array of device names. Duration in milliseconds (default 5000). Check "show on OLED" to display scanning animation.');
  }
};

Blockly.Blocks['ble_client_connect'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("BLE Client")
        .appendField(new Blockly.FieldImage("media/ble.png", 64, 64))
        .appendField("Connect");
    this.appendValueInput("DEVICE_NAME")
        .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("device name");
    this.setOutput(true, 'Boolean');
    this.setTooltip('Connect to a BLE device by name. Returns true if connection successful.');
  }
};

Blockly.Blocks['ble_client_disconnect'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("BLE Client")
        .appendField(new Blockly.FieldImage("media/ble.png", 64, 64))
        .appendField("Disconnect");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Disconnect from the currently connected BLE device.');
  }
};

Blockly.Blocks['ble_client_is_connected'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("BLE Client")
        .appendField(new Blockly.FieldImage("media/ble.png", 64, 64))
        .appendField("Is Connected");
    this.setOutput(true, 'Boolean');
    this.setTooltip('Returns true if connected to a BLE device.');
  }
};

Blockly.Blocks['ble_client_write_string'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("BLE Client")
        .appendField(new Blockly.FieldImage("media/ble.png", 64, 64))
        .appendField("Write String");
    this.appendValueInput("UUID")
        .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("characteristic UUID");
    this.appendValueInput("VALUE")
        .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("value");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Write a string value to a BLE characteristic. UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
  }
};

Blockly.Blocks['ble_client_write_bytes'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("BLE Client")
        .appendField(new Blockly.FieldImage("media/ble.png", 64, 64))
        .appendField("Write Bytes");
    this.appendValueInput("UUID")
        .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("characteristic UUID");
    this.appendValueInput("VALUE")
        .setCheck('Array')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("value (byte array)");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Write a byte array to a BLE characteristic. UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
  }
};

Blockly.Blocks['ble_client_read_string'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("BLE Client")
        .appendField(new Blockly.FieldImage("media/ble.png", 64, 64))
        .appendField("Read String");
    this.appendValueInput("UUID")
        .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("characteristic UUID");
    this.setOutput(true, 'String');
    this.setTooltip('Read a string value from a BLE characteristic. UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
  }
};

Blockly.Blocks['ble_client_read_bytes'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("BLE Client")
        .appendField(new Blockly.FieldImage("media/ble.png", 64, 64))
        .appendField("Read Bytes");
    this.appendValueInput("UUID")
        .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("characteristic UUID");
    this.setOutput(true, 'Array');
    this.setTooltip('Read a byte array from a BLE characteristic. UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
  }
};

Blockly.Blocks['ble_client_notify'] = {
  init: function() {
    this.setColour(0);
    this.appendDummyInput()
        .appendField("BLE Client")
        .appendField(new Blockly.FieldImage("media/ble.png", 64, 64))
        .appendField("On Notify");
    this.appendValueInput("UUID")
        .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("characteristic UUID");
    this.appendStatementInput("CALLBACK_CODE")
        .appendField("do");
    this.setPreviousStatement(true, "interrupts");
    this.setNextStatement(true, "interrupts");
    this.setTooltip('Subscribe to notifications from a BLE characteristic. Place in Interrupts block. UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
  }
};

Blockly.Blocks['ble_client_notify_value'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("BLE Notify")
        .appendField(new Blockly.FieldImage("media/ble.png", 40, 40))
        .appendField("Value");
    this.setOutput(true, 'String');
    this.setTooltip('Returns the notification value as string. Only valid inside "On Notify" callback.');
  }
};

Blockly.Blocks['ble_client_notify_bytes'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("BLE Notify")
        .appendField(new Blockly.FieldImage("media/ble.png", 40, 40))
        .appendField("Bytes");
    this.setOutput(true, 'Array');
    this.setTooltip('Returns the notification value as byte array. Only valid inside "On Notify" callback.');
  }
};

Blockly.Blocks['ble_client_test'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("BLE Client")
        .appendField(new Blockly.FieldImage("media/ble.png", 64, 64))
        .appendField("Test");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Test BLE client by scanning for devices and printing results to Serial.');
  }
};
