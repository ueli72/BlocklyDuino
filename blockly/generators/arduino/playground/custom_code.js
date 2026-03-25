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
 * @fileoverview Generating Arduino for Custom Code blocks.
 */
'use strict';

Blockly.Arduino.custom_code_statement = function() {
  var code = this.getFieldValue('CODE');
  if (code) {
    code = code.replace(/\n/g, '\n');
    if (!code.endsWith('\n')) {
      code += '\n';
    }
  }
  return code || '';
};

Blockly.Arduino.custom_code_expression = function() {
  var code = this.getFieldValue('CODE') || '0';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.custom_code_include = function() {
  var code = this.getFieldValue('CODE');
  if (code) {
    var key = 'custom_include_' + code.hashCode();
    Blockly.Arduino.definitions_[key] = code + '\n';
  }
  return '';
};

String.prototype.hashCode = function() {
  var hash = 0, i, chr;
  if (this.length === 0) return hash;
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return Math.abs(hash);
};
