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
 * @fileoverview Generating Arduino for WS2812 LED Strip blocks.
 */
'use strict';

Blockly.Arduino.ws2812_init = function() {
  var dropdown_pin = this.getFieldValue('PIN');
  var count = Blockly.Arduino.valueToCode(this, 'COUNT', Blockly.Arduino.ORDER_ATOMIC);
  Blockly.Arduino.definitions_['include_ws2812_h'] = '#include "ws2812.h"\n';
  var code = 'initWS2812(' + dropdown_pin + ', ' + count + ');  // Initialize WS2812 LED strip with ' + count + ' LEDs on pin ' + dropdown_pin + '\n';
  return code;
};

Blockly.Arduino.ws2812_set_pixel = function() {
  Blockly.Arduino.definitions_['include_ws2812_h'] = '#include "ws2812.h"\n';
  var index = Blockly.Arduino.valueToCode(this, 'INDEX', Blockly.Arduino.ORDER_ATOMIC);
  var red = Blockly.Arduino.valueToCode(this, 'RED', Blockly.Arduino.ORDER_ATOMIC);
  var green = Blockly.Arduino.valueToCode(this, 'GREEN', Blockly.Arduino.ORDER_ATOMIC);
  var blue = Blockly.Arduino.valueToCode(this, 'BLUE', Blockly.Arduino.ORDER_ATOMIC);
  var code = 'setWS2812Pixel(' + index + ', ' + red + ', ' + green + ', ' + blue + ');\n';
  return code;
};

Blockly.Arduino.ws2812_fill = function() {
  Blockly.Arduino.definitions_['include_ws2812_h'] = '#include "ws2812.h"\n';
  var red = Blockly.Arduino.valueToCode(this, 'RED', Blockly.Arduino.ORDER_ATOMIC);
  var green = Blockly.Arduino.valueToCode(this, 'GREEN', Blockly.Arduino.ORDER_ATOMIC);
  var blue = Blockly.Arduino.valueToCode(this, 'BLUE', Blockly.Arduino.ORDER_ATOMIC);
  var code = 'fillWS2812(' + red + ', ' + green + ', ' + blue + ');\n';
  return code;
};

Blockly.Arduino.ws2812_show = function() {
  Blockly.Arduino.definitions_['include_ws2812_h'] = '#include "ws2812.h"\n';
  var code = 'showWS2812();\n';
  return code;
};

Blockly.Arduino.ws2812_off = function() {
  Blockly.Arduino.definitions_['include_ws2812_h'] = '#include "ws2812.h"\n';
  var code = 'turnOffWS2812();\n';
  return code;
};

Blockly.Arduino.ws2812_test = function() {
  Blockly.Arduino.definitions_['include_ws2812_h'] = '#include "ws2812.h"\n';
  var code = 'testWS2812();\n';
  return code;
};
