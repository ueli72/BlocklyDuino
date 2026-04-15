/**
 * Visual Blocks Language
 *
 * Copyright 2012 Fred Lin.
 * https://github.com/gasolin/BlocklyDuino
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
 * @fileoverview Helper functions for generating Arduino blocks.
 * @author gasolin@gmail.com (Fred Lin)
 */
'use strict';




Blockly.Arduino.base_delay = function() {
  var delay_time = Blockly.Arduino.valueToCode(this, 'DELAY_TIME', Blockly.Arduino.ORDER_ATOMIC) || '1000'
  var code = 'delay(' + delay_time + ');\n';
  return code;
};

Blockly.Arduino.base_map = function() {
  var value_num = Blockly.Arduino.valueToCode(this, 'NUM', Blockly.Arduino.ORDER_NONE) || '0';
  var value_from_min = Blockly.Arduino.valueToCode(this, 'FROM_MIN', Blockly.Arduino.ORDER_ATOMIC) || '0';
  var value_from_max = Blockly.Arduino.valueToCode(this, 'FROM_MAX', Blockly.Arduino.ORDER_ATOMIC) || '1024';
  var value_to_min = Blockly.Arduino.valueToCode(this, 'TO_MIN', Blockly.Arduino.ORDER_ATOMIC) || '0';
  var value_to_max = Blockly.Arduino.valueToCode(this, 'TO_MAX', Blockly.Arduino.ORDER_ATOMIC) || '255';
  var code = 'map(' + value_num + ', ' + value_from_min + ', ' + value_from_max + ', ' + value_to_min + ', ' + value_to_max + ')';
  return [code, Blockly.Arduino.ORDER_NONE];
};

Blockly.Arduino.inout_buildin_led = function() {
  var dropdown_stat = this.getFieldValue('STAT');
  Blockly.Arduino.setups_['setup_output_13'] = 'pinMode(13, OUTPUT);';
  var code = 'digitalWrite(13, ' + dropdown_stat + ');\n'
  return code;
};

Blockly.Arduino.inout_digital_write = function() {
  var dropdown_pin = this.getFieldValue('PIN');
  var dropdown_stat = this.getFieldValue('STAT');
  Blockly.Arduino.setups_['setup_output_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', OUTPUT);';
  var code = 'digitalWrite(' + dropdown_pin + ', ' + dropdown_stat + ');\n'
  return code;
};

Blockly.Arduino.inout_digital_read = function() {
  var dropdown_pin = this.getFieldValue('PIN');
  Blockly.Arduino.setups_['setup_input_' + dropdown_pin] = 'pinMode(' + dropdown_pin + ', INPUT);';
  var code = 'digitalRead(' + dropdown_pin + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.inout_analog_write = function() {
  var dropdown_pin = this.getFieldValue('PIN');
  //var dropdown_stat = this.getFieldValue('STAT');
  var value_num = Blockly.Arduino.valueToCode(this, 'NUM', Blockly.Arduino.ORDER_ATOMIC);
  //Blockly.Arduino.setups_['setup_output'+dropdown_pin] = 'pinMode('+dropdown_pin+', OUTPUT);';
  var code = 'analogWrite(' + dropdown_pin + ', ' + value_num + ');\n';
  return code;
};

Blockly.Arduino.inout_analog_read = function() {
  var dropdown_pin = this.getFieldValue('PIN');
  //Blockly.Arduino.setups_['setup_input_'+dropdown_pin] = 'pinMode('+dropdown_pin+', INPUT);';
  var code = 'analogRead(' + dropdown_pin + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.inout_tone = function() {
  var dropdown_pin = this.getFieldValue("PIN");
  var value_num = Blockly.Arduino.valueToCode(this, "NUM", Blockly.Arduino.ORDER_ATOMIC);
  Blockly.Arduino.setups_['setup_output'+dropdown_pin] = 'pinMode('+dropdown_pin+', OUTPUT);';
  var code = "tone(" + dropdown_pin + ", " + value_num + ");\n";
  return code;
};

Blockly.Arduino.inout_notone = function() {
  var dropdown_pin = this.getFieldValue("PIN");
  Blockly.Arduino.setups_['setup_output'+dropdown_pin] = 'pinMode('+dropdown_pin+', OUTPUT);';
  var code = "noTone(" + dropdown_pin + ");\n";
  return code;
};

Blockly.Arduino.inout_highlow = function() {
  // Boolean values HIGH and LOW.
  var code = (this.getFieldValue('BOOL') == 'HIGH') ? 'HIGH' : 'LOW';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.inout_pinmode = function() {
  if (!this.getParent()) {
    return '';
  }
  var dropdown_pin = this.getFieldValue('PIN');
  var dropdown_mode = this.getFieldValue('MODE');
  var code = 'pinMode(' + dropdown_pin + ', ' + dropdown_mode + ');\n';
  return code;
};

Blockly.Arduino.inout_pulsein = function() {
  var dropdown_pin = this.getFieldValue('PIN');
  var dropdown_value = this.getFieldValue('VALUE');
  var timeout = Blockly.Arduino.valueToCode(this, 'TIMEOUT', Blockly.Arduino.ORDER_ATOMIC) || '1000000';
  var code = 'pulseIn(' + dropdown_pin + ', ' + dropdown_value + ', ' + timeout + ')';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.serial_print = function() {
  var content = Blockly.Arduino.valueToCode(this, 'CONTENT', Blockly.Arduino.ORDER_ATOMIC) || '0'
  //content = content.replace('(','').replace(')','');

  Blockly.Arduino.setups_['setup_serial_' + profile.default.serial] = 'Serial.begin(' + profile.default.serial + ');\n';

  var code = 'Serial.println(' + content + ');\n';
  return code;
};
