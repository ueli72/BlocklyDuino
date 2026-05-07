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
 * @fileoverview Generating Arduino for BLE Client blocks.
 */
'use strict';

function isBLEClientBlockInInterrupts(block) {
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

Blockly.Arduino.ble_client_init = function() {
  Blockly.Arduino.definitions_['include_ble_client_h'] = '#include "ble_client.h"\n';
  var code = 'initBLEClient();\n';
  return code;
};

Blockly.Arduino.ble_client_scan = function() {
  Blockly.Arduino.definitions_['include_ble_client_h'] = '#include "ble_client.h"\n';
  var duration = Blockly.Arduino.valueToCode(this, 'DURATION', Blockly.Arduino.ORDER_ATOMIC) || '5000';
  var code = 'scanBLEDevices(' + duration + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.ble_client_connect = function() {
  Blockly.Arduino.definitions_['include_ble_client_h'] = '#include "ble_client.h"\n';
  var deviceName = Blockly.Arduino.valueToCode(this, 'DEVICE_NAME', Blockly.Arduino.ORDER_ATOMIC) || '""';
  var code = 'connectBLEDevice(' + deviceName + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.ble_client_disconnect = function() {
  Blockly.Arduino.definitions_['include_ble_client_h'] = '#include "ble_client.h"\n';
  var code = 'disconnectBLEDevice();\n';
  return code;
};

Blockly.Arduino.ble_client_is_connected = function() {
  Blockly.Arduino.definitions_['include_ble_client_h'] = '#include "ble_client.h"\n';
  var code = 'isBLEClientConnected()';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.ble_client_write_string = function() {
  Blockly.Arduino.definitions_['include_ble_client_h'] = '#include "ble_client.h"\n';
  var uuid = Blockly.Arduino.valueToCode(this, 'UUID', Blockly.Arduino.ORDER_ATOMIC) || '""';
  var value = Blockly.Arduino.valueToCode(this, 'VALUE', Blockly.Arduino.ORDER_ATOMIC) || '""';
  var code = 'writeBLEString(' + uuid + ', ' + value + ');\n';
  return code;
};

Blockly.Arduino.ble_client_write_bytes = function() {
  Blockly.Arduino.definitions_['include_ble_client_h'] = '#include "ble_client.h"\n';
  var uuid = Blockly.Arduino.valueToCode(this, 'UUID', Blockly.Arduino.ORDER_ATOMIC) || '""';
  var value = Blockly.Arduino.valueToCode(this, 'VALUE', Blockly.Arduino.ORDER_ATOMIC) || '{}';
  var returnSuccess = this.getFieldValue('RETURN_SUCCESS') === 'TRUE';
  if (returnSuccess) {
    var code = 'writeBLEBytes(' + uuid + ', ' + value + ')';
    return [code, Blockly.Arduino.ORDER_ATOMIC];
  } else {
    var code = 'writeBLEBytes(' + uuid + ', ' + value + ');\n';
    return code;
  }
};

Blockly.Arduino.ble_client_read_string = function() {
  Blockly.Arduino.definitions_['include_ble_client_h'] = '#include "ble_client.h"\n';
  var uuid = Blockly.Arduino.valueToCode(this, 'UUID', Blockly.Arduino.ORDER_ATOMIC) || '""';
  var code = 'readBLEString(' + uuid + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.ble_client_read_bytes = function() {
  Blockly.Arduino.definitions_['include_ble_client_h'] = '#include "ble_client.h"\n';
  var uuid = Blockly.Arduino.valueToCode(this, 'UUID', Blockly.Arduino.ORDER_ATOMIC) || '""';
  var code = 'readBLEBytes(' + uuid + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.ble_client_notify = function() {
  if (!isBLEClientBlockInInterrupts(this)) {
    return '';
  }
  
  var blockKey = 'ble_client_notify_callback';
  
  if (Blockly.Arduino.generated_[blockKey]) {
    return '';
  }
  
  Blockly.Arduino.definitions_['include_ble_client_h'] = '#include "ble_client.h"\n';
  var uuid = Blockly.Arduino.valueToCode(this, 'UUID', Blockly.Arduino.ORDER_ATOMIC) || '""';
  var branch = Blockly.Arduino.statementToCode(this, 'CALLBACK_CODE');
  
  var callbackName = 'ble_notify_callback';
  
  var callbackCode = '// BLE callback: called when notification received\n';
  callbackCode += 'void ' + callbackName + '(const std::string& value) {\n' + branch + '}\n';
  Blockly.Arduino.definitions_[callbackName] = callbackCode;
  
  Blockly.Arduino.setups_[blockKey] = 'subscribeBLENotify(' + uuid + ', ' + callbackName + ');\n';
  
  Blockly.Arduino.generated_[blockKey] = true;
  
  return '';
};

Blockly.Arduino.ble_client_notify_value = function() {
  return ['getBLENotifyValue()', Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.ble_client_notify_bytes = function() {
  return ['getBLENotifyBytes()', Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.ble_client_test = function() {
  Blockly.Arduino.definitions_['include_ble_client_h'] = '#include "ble_client.h"\n';
  var code = 'testBLEClient();\n';
  return code;
};
