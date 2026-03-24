/**
 * @license
 * Visual Blocks Editor
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
 * @fileoverview MAX98357A I2S amplifier blocks.
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.max98357a = {};

Blockly.Blocks['max98357a_init'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("MAX98357A")
        .appendField(new Blockly.FieldImage("../../media/max98357a.png", 64, 64))
        .appendField("Initialize");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Initialize the MAX98357A I2S amplifier');
  }
};

Blockly.Blocks['max98357a_play_tone'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("MAX98357A")
        .appendField(new Blockly.FieldImage("../../media/max98357a.png", 64, 64))
        .appendField("Play Tone");
    this.appendValueInput("FREQUENCY", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Frequency (Hz)");
    this.appendValueInput("DURATION", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Duration (ms)");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Play a tone at specified frequency for a duration');
  }
};

Blockly.Blocks['max98357a_stop'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("MAX98357A")
        .appendField(new Blockly.FieldImage("../../media/max98357a.png", 64, 64))
        .appendField("Stop");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Stop audio output');
  }
};

Blockly.Blocks['max98357a_test'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("MAX98357A")
        .appendField(new Blockly.FieldImage("../../media/max98357a.png", 64, 64))
        .appendField("Test");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Test the MAX98357A amplifier');
  }
};

Blockly.Blocks['max98357a_play_file'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("MAX98357A")
        .appendField(new Blockly.FieldImage("../../media/max98357a.png", 64, 64))
        .appendField("Play WAV File");
    this.appendValueInput("FILENAME", 'String')
        .setCheck('String')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Filename (.wav)");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Play a WAV file from SD card (16kHz, 8bit mono required)');
  }
};

Blockly.Blocks['max98357a_is_playing'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("MAX98357A")
        .appendField(new Blockly.FieldImage("../../media/max98357a.png", 64, 64))
        .appendField("Is Playing");
    this.setOutput(true, 'Boolean');
    this.setTooltip('Returns true if audio is currently playing');
  }
};

Blockly.Blocks['max98357a_wait_until_done'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("MAX98357A")
        .appendField(new Blockly.FieldImage("../../media/max98357a.png", 64, 64))
        .appendField("Wait Until Done");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Wait until audio playback is finished');
  }
};
