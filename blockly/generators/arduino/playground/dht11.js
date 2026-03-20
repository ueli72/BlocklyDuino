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
 * @fileoverview Generating Arduino for DHT11 sensor blocks.
 */
'use strict';

Blockly.Arduino.dht11_init = function() {
  Blockly.Arduino.definitions_['include_dht11_h'] = '#include "dht11.h"\n';
  var code = 'initDHT11();\n';
  return code;
};

Blockly.Arduino.dht11_read_temp = function() {
  Blockly.Arduino.definitions_['include_dht11_h'] = '#include "dht11.h"\n';
  var code = 'readDHT11Temperature()';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.dht11_read_humidity = function() {
  Blockly.Arduino.definitions_['include_dht11_h'] = '#include "dht11.h"\n';
  var code = 'readDHT11Humidity()';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.dht11_test = function() {
  Blockly.Arduino.definitions_['include_dht11_h'] = '#include "dht11.h"\n';
  Blockly.Arduino.definitions_['include_oled_h'] = '#include "oled.h"\n';
  var code = 'testDHT11();\n';
  return code;
};
