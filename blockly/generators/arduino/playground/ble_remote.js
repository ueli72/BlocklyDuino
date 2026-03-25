/**
 * Visual Blocks Language
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
 * @fileoverview Generating Arduino for BLE Remote Control blocks.
 */
'use strict';

Blockly.Arduino.ble_remote_init = function() {
  var name = this.getFieldValue('NAME');
  Blockly.Arduino.definitions_['include_ble_remote_h'] = '#include "ble_remote.h"\n';
  
  var code = 'initBLERemote("' + name + '");  // Initialize BLE with device name: ' + name + '\n';
  return code;
};

Blockly.Arduino.ble_remote_on_direction = function() {
  Blockly.Arduino.definitions_['include_ble_remote_h'] = '#include "ble_remote.h"\n';
  var branch = Blockly.Arduino.statementToCode(this, 'CALLBACK_CODE');
  
  var callbackName = Blockly.Arduino.variableDB_.getDistinctName('ble_direction_callback', Blockly.Procedures.NAME_TYPE);
  
  var callbackCode = '// BLE callback: called when direction changes from remote\n';
  callbackCode += 'void ' + callbackName + '(int8_t direction) {\n' + branch + '}\n';
  Blockly.Arduino.definitions_[callbackName] = callbackCode;
  
  var code = 'setBLEDirectionCallback(' + callbackName + ');  // Register direction callback\n';
  return code;
};

Blockly.Arduino.ble_remote_on_speed = function() {
  Blockly.Arduino.definitions_['include_ble_remote_h'] = '#include "ble_remote.h"\n';
  var branch = Blockly.Arduino.statementToCode(this, 'CALLBACK_CODE');
  
  var callbackName = Blockly.Arduino.variableDB_.getDistinctName('ble_speed_callback', Blockly.Procedures.NAME_TYPE);
  
  var callbackCode = '// BLE callback: called when speed changes from remote\n';
  callbackCode += 'void ' + callbackName + '(uint8_t speed) {\n' + branch + '}\n';
  Blockly.Arduino.definitions_[callbackName] = callbackCode;
  
  var code = 'setBLESpeedCallback(' + callbackName + ');  // Register speed callback\n';
  return code;
};

Blockly.Arduino.ble_remote_on_command = function() {
  Blockly.Arduino.definitions_['include_ble_remote_h'] = '#include "ble_remote.h"\n';
  var branch = Blockly.Arduino.statementToCode(this, 'CALLBACK_CODE');
  
  var callbackName = Blockly.Arduino.variableDB_.getDistinctName('ble_command_callback', Blockly.Procedures.NAME_TYPE);
  
  var callbackCode = '// BLE callback: called when command is received from remote\n';
  callbackCode += 'void ' + callbackName + '(uint8_t command) {\n' + branch + '}\n';
  Blockly.Arduino.definitions_[callbackName] = callbackCode;
  
  var code = 'setBLECommandCallback(' + callbackName + ');  // Register command callback\n';
  return code;
};

Blockly.Arduino.ble_remote_direction_value = function() {
  return ['direction', Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.ble_remote_speed_value = function() {
  return ['speed', Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.ble_remote_command_value = function() {
  return ['command', Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.ble_remote_send = function() {
  Blockly.Arduino.definitions_['include_ble_remote_h'] = '#include "ble_remote.h"\n';
  var value = Blockly.Arduino.valueToCode(this, 'VALUE', Blockly.Arduino.ORDER_ATOMIC);
  var code = 'sendBLEData(' + value + ');\n';
  return code;
};

Blockly.Arduino.ble_remote_is_connected = function() {
  Blockly.Arduino.definitions_['include_ble_remote_h'] = '#include "ble_remote.h"\n';
  var code = 'isBLEConnected()';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.ble_remote_test = function() {
  Blockly.Arduino.definitions_['include_ble_remote_h'] = '#include "ble_remote.h"\n';
  var code = 'testBLERemote();\n';
  return code;
};
