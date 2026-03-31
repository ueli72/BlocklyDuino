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
 * @fileoverview Generating Arduino for Relais blocks.
 */
'use strict';

Blockly.Arduino.relais_set = function() {
  var dropdown_relay = this.getFieldValue('RELAY');
  var dropdown_state = this.getFieldValue('STATE');
  Blockly.Arduino.definitions_['include_relais_h'] = '#include "relais.h"\n';
  var stateText = dropdown_state === 'true' ? 'ON' : 'OFF';
  var code = 'setRelay(' + dropdown_relay + ', ' + dropdown_state + ');  // Turn relay ' + dropdown_relay + ' ' + stateText + '\n';
  return code;
};

Blockly.Arduino.relais_test = function() {
  Blockly.Arduino.definitions_['include_relais_h'] = '#include "relais.h"\n';
  var code = 'testRelaisSequence();\n';
  return code;
};
