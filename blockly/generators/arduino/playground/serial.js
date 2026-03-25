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
 * @fileoverview Generating Arduino for Serial blocks.
 */
'use strict';

Blockly.Arduino.serial_init = function() {
  var baud = this.getFieldValue('BAUD');
  
  Blockly.Arduino.definitions_['include_serial_h'] = '#include "serial.h"\n';
  
  var code = 'initSerial(' + baud + ');\n';
  return code;
};

Blockly.Arduino.serial_print = function() {
  var text = Blockly.Arduino.valueToCode(this, 'TEXT', Blockly.Arduino.ORDER_ATOMIC) || '""';
  
  Blockly.Arduino.definitions_['include_serial_h'] = '#include "serial.h"\n';
  
  var code = 'serialPrint(' + text + ');\n';
  return code;
};

Blockly.Arduino.serial_println = function() {
  var text = Blockly.Arduino.valueToCode(this, 'TEXT', Blockly.Arduino.ORDER_ATOMIC) || '""';
  
  Blockly.Arduino.definitions_['include_serial_h'] = '#include "serial.h"\n';
  
  var code = 'serialPrintln(' + text + ');\n';
  return code;
};

Blockly.Arduino.serial_read_char = function() {
  var blocking = this.getFieldValue('BLOCKING');
  
  Blockly.Arduino.definitions_['include_serial_h'] = '#include "serial.h"\n';
  
  var code = 'serialReadChar(' + blocking + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.serial_read_line = function() {
  Blockly.Arduino.definitions_['include_serial_h'] = '#include "serial.h"\n';
  
  var code = 'serialReadLine()';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.serial_available = function() {
  Blockly.Arduino.definitions_['include_serial_h'] = '#include "serial.h"\n';
  
  var code = 'serialAvailable()';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};
