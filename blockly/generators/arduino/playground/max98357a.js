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
 * @fileoverview Generating Arduino for MAX98357A I2S amplifier blocks.
 */
'use strict';

Blockly.Arduino.max98357a_init = function() {
  Blockly.Arduino.definitions_['include_max98357a_h'] = '#include "max98357a.h"\n';
  var code = 'initMAX98357A();\n';
  return code;
};

Blockly.Arduino.max98357a_play_tone = function() {
  var frequency = Blockly.Arduino.valueToCode(this, 'FREQUENCY', Blockly.Arduino.ORDER_ATOMIC) || '440';
  var duration = Blockly.Arduino.valueToCode(this, 'DURATION', Blockly.Arduino.ORDER_ATOMIC) || '1000';

  Blockly.Arduino.definitions_['include_max98357a_h'] = '#include "max98357a.h"\n';

  var code = 'playTone(' + frequency + ', ' + duration + ');\n';
  return code;
};

Blockly.Arduino.max98357a_stop = function() {
  Blockly.Arduino.definitions_['include_max98357a_h'] = '#include "max98357a.h"\n';

  var code = 'stopAudio();\n';
  return code;
};

Blockly.Arduino.max98357a_test = function() {
  Blockly.Arduino.definitions_['include_max98357a_h'] = '#include "max98357a.h"\n';

  var code = 'testMAX98357A();\n';
  return code;
};

Blockly.Arduino.max98357a_play_file = function() {
  var filename = Blockly.Arduino.valueToCode(this, 'FILENAME', Blockly.Arduino.ORDER_ATOMIC) || '"audio.wav"';

  Blockly.Arduino.definitions_['include_max98357a_h'] = '#include "max98357a.h"\n';
  Blockly.Arduino.definitions_['include_sdcard_h'] = '#include "sdcard.h"\n';

  var code = 'playAudioFile(' + filename + ');\n';
  return code;
};

Blockly.Arduino.max98357a_is_playing = function() {
  Blockly.Arduino.definitions_['include_max98357a_h'] = '#include "max98357a.h"\n';

  var code = 'isPlaying()';
  return [code, Blockly.Arduino.ORDER_ATOMIC];
};

Blockly.Arduino.max98357a_wait_until_done = function() {
  Blockly.Arduino.definitions_['include_max98357a_h'] = '#include "max98357a.h"\n';

  var code = 'while (isPlaying()) { delay(10); }\n';
  return code;
};
