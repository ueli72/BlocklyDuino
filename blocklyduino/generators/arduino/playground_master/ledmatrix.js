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
 * @fileoverview Generating Arduino for LED Matrix blocks.
 */
'use strict';

Blockly.Arduino.led_matrix_init = function() {
  Blockly.Arduino.definitions_['include_ledmatrix_h'] = '#include "LEDMatrix.h"\n';
  var code = 'initializeLEDMatrix();  // Initialize 5x5 LED matrix display\n';
  return code;
};

Blockly.Arduino.led_matrix_set_pixel = function() {
  Blockly.Arduino.definitions_['include_ledmatrix_h'] = '#include "LEDMatrix.h"\n';
  var index = Blockly.Arduino.valueToCode(this, 'INDEX', Blockly.Arduino.ORDER_ATOMIC);
  var red = Blockly.Arduino.valueToCode(this, 'RED', Blockly.Arduino.ORDER_ATOMIC);
  var green = Blockly.Arduino.valueToCode(this, 'GREEN', Blockly.Arduino.ORDER_ATOMIC);
  var blue = Blockly.Arduino.valueToCode(this, 'BLUE', Blockly.Arduino.ORDER_ATOMIC);
  var code = 'setLEDMatrixPixel(' + index + ', ' + red + ', ' + green + ', ' + blue + ');  // Set pixel ' + index + ' color\n';
  return code;
};

Blockly.Arduino.led_matrix_fill = function() {
  Blockly.Arduino.definitions_['include_ledmatrix_h'] = '#include "LEDMatrix.h"\n';
  var red = Blockly.Arduino.valueToCode(this, 'RED', Blockly.Arduino.ORDER_ATOMIC);
  var green = Blockly.Arduino.valueToCode(this, 'GREEN', Blockly.Arduino.ORDER_ATOMIC);
  var blue = Blockly.Arduino.valueToCode(this, 'BLUE', Blockly.Arduino.ORDER_ATOMIC);
  var code = 'fillLEDMatrix(' + red + ', ' + green + ', ' + blue + ');  // Fill entire matrix with color\n';
  return code;
};

Blockly.Arduino.led_matrix_show = function() {
  Blockly.Arduino.definitions_['include_ledmatrix_h'] = '#include "LEDMatrix.h"\n';
  var code = 'showLEDMatrix();  // Display the current buffer on the matrix\n';
  return code;
};

Blockly.Arduino.led_matrix_off = function() {
  Blockly.Arduino.definitions_['include_ledmatrix_h'] = '#include "LEDMatrix.h"\n';
  var code = 'turnOffLEDMatrix();  // Turn off all LEDs in the matrix\n';
  return code;
};

Blockly.Arduino.led_matrix_test = function() {
  Blockly.Arduino.definitions_['include_ledmatrix_h'] = '#include "LEDMatrix.h"\n';
  var code = 'runLEDMatrixTest();\n';
  return code;
};
