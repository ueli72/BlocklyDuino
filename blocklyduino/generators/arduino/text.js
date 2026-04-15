/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://blockly.googlecode.com/
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
 * @fileoverview Generating Arduino for text blocks.
 * @author gasolin@gmail.com (Fred Lin)
 */
'use strict';




Blockly.Arduino.text = function() {
  // Text value.
  var code = Blockly.Arduino.quote_(this.getFieldValue('TEXT'));
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.text_join = function() {
  // Concatenate multiple items into a string.
  var code = '';
  var itemCount = this.itemCount_;
  
  // Build string concatenation using String() constructor for each item
  var parts = [];
  for (var i = 0; i < itemCount; i++) {
    var itemCode = Blockly.Arduino.valueToCode(this, 'ADD' + i, 
        Blockly.Arduino.ORDER_NONE) || '""';
    // Wrap each item with String() to convert any type to string
    parts.push('String(' + itemCode + ')');
  }
  
  // Join with + operator
  code = parts.join(' + ');
  
  return [code, Blockly.Arduino.ORDER_ADDITIVE];
};
