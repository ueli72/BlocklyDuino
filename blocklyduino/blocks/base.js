/**
 * @license
 * Visual Blocks Editor
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

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.base = {};

function getDigitalPins() {
  if (typeof profile !== 'undefined' && profile.default && profile.default.digital) {
    return profile.default.digital;
  }
  return [["0", "0"], ["1", "1"], ["2", "2"]];
}

function getAnalogPins() {
  if (typeof profile !== 'undefined' && profile.default && profile.default.analog) {
    return profile.default.analog;
  }
  return [["0", "0"], ["1", "1"], ["2", "2"]];
}

//To support syntax defined in http://arduino.cc/en/Reference/HomePage




Blockly.Blocks['base_delay'] = {
  helpUrl: 'http://arduino.cc/en/Reference/delay',
  init: function() {
    this.setColour(120);
    this.appendValueInput("DELAY_TIME", 'Number')
        .appendField("Delay")
        .setCheck('Number');
    this.setInputsInline(true);
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Delay specific time');
  }
};

Blockly.Blocks['base_map'] = {
  helpUrl: 'http://arduino.cc/en/Reference/map',
  init: function() {
    this.setColour(230);
    this.appendValueInput("NUM", 'Number')
        .appendField("Map ")
        .setCheck('Number');
    this.appendValueInput("FROM_MIN", 'Number')
        .appendField("from [")
        .setCheck('Number');
    this.appendValueInput("FROM_MAX", 'Number')
        .appendField("-")
        .setCheck('Number');
    this.appendDummyInput()
        .appendField("]");
    this.appendValueInput("TO_MIN", 'Number')
        .appendField("to [")
        .setCheck('Number');
    this.appendValueInput("TO_MAX", 'Number')
        .appendField("-")
        .setCheck('Number');
    this.appendDummyInput()
        .appendField("]");
    this.setInputsInline(true);
    this.setOutput(true);
    this.setTooltip('Re-maps a number from one range to another.');
  }
};

Blockly.Blocks['inout_buildin_led'] = {
   helpUrl: 'http://arduino.cc/en/Reference/DigitalWrite',
   init: function() {
     this.setColour(190);
     this.appendDummyInput()
	       .appendField("Build-in LED Stat")
	       .appendField(new Blockly.FieldDropdown([["HIGH", "HIGH"], ["LOW", "LOW"]]), "STAT");
     this.setPreviousStatement(true, "general");
     this.setNextStatement(true, "general");
     this.setTooltip('light or off the build-in LED');
   }
};

Blockly.Blocks['inout_digital_write'] = {
  helpUrl: 'http://arduino.cc/en/Reference/DigitalWrite',
  init: function() {
    this.setColour(230);
    this.appendDummyInput()
	      .appendField("DigitalWrite PIN#")
	      .appendField(new Blockly.FieldDropdown(getDigitalPins()), "PIN")
      	.appendField("Stat")
      	.appendField(new Blockly.FieldDropdown([["HIGH", "HIGH"], ["LOW", "LOW"]]), "STAT");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Write digital value to a specific Port');
  }
};

Blockly.Blocks['inout_digital_read'] = {
  helpUrl: 'http://arduino.cc/en/Reference/DigitalRead',
  init: function() {
    this.setColour(230);
    this.appendDummyInput()
	      .appendField("DigitalRead PIN#")
	      .appendField(new Blockly.FieldDropdown(getDigitalPins()), "PIN");
    this.setOutput(true, 'Boolean');
    this.setTooltip('');
  }
};

Blockly.Blocks['inout_analog_write'] = {
  helpUrl: 'http://arduino.cc/en/Reference/AnalogWrite',
  init: function() {
    this.setColour(230);
    this.appendDummyInput()
        .appendField("AnalogWrite PIN#")
        .appendField(new Blockly.FieldDropdown(getDigitalPins()), "PIN");
    this.appendValueInput("NUM", 'Number')
        .appendField("value")
        .setCheck('Number');
    this.setInputsInline(true);
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Write analog value between 0 and 255 to a specific Port');
  }
};

Blockly.Blocks['inout_analog_read'] = {
  helpUrl: 'http://arduino.cc/en/Reference/AnalogRead',
  init: function() {
    this.setColour(230);
    this.appendDummyInput()
        .appendField("AnalogRead PIN#")
        .appendField(new Blockly.FieldDropdown(getAnalogPins()), "PIN");
    this.setOutput(true, 'Number');
    this.setTooltip('Return value between 0 and 1024');
  }
};

Blockly.Blocks['inout_tone'] = {
  helpUrl: 'http://www.arduino.cc/en/Reference/Tone',
  init: function() {
    this.setColour(230);
    this.appendDummyInput()
        .appendField("Tone PIN#")
        .appendField(new Blockly.FieldDropdown(getDigitalPins()), "PIN");
    this.appendValueInput("NUM", "Number")
        .appendField("frequency")
        .setCheck("Number");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip("Generate audio tones on a pin");
  }
};

Blockly.Blocks['inout_notone'] = {
  helpUrl: 'http://www.arduino.cc/en/Reference/NoTone',
  init: function() {
    this.setColour(230);
    this.appendDummyInput()
        .appendField("No tone PIN#")
        .appendField(new Blockly.FieldDropdown(getDigitalPins()), "PIN");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip("Stop generating a tone on a pin");
  }
};

Blockly.Blocks['inout_highlow'] = {
  helpUrl: 'http://arduino.cc/en/Reference/Constants',
  init: function() {
    this.setColour(230);
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["HIGH", "HIGH"], ["LOW", "LOW"]]), 'BOOL')
    this.setOutput(true, 'Boolean');
    this.setTooltip('');
  }
};

Blockly.Blocks['inout_pinmode'] = {
  helpUrl: 'http://arduino.cc/en/Reference/PinMode',
  init: function() {
    this.setColour(30);
    this.appendDummyInput()
        .appendField("PinMode PIN#")
        .appendField(new Blockly.FieldDropdown(getDigitalPins()), "PIN")
        .appendField("Mode")
        .appendField(new Blockly.FieldDropdown([["INPUT", "INPUT"], ["OUTPUT", "OUTPUT"], ["INPUT_PULLUP", "INPUT_PULLUP"], ["INPUT_PULLDOWN", "INPUT_PULLDOWN"]]), "MODE");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Set the mode of a digital pin (typically used in Setup)');
  }
};

Blockly.Blocks['inout_pulsein'] = {
  helpUrl: 'http://arduino.cc/en/Reference/PulseIn',
  init: function() {
    this.setColour(230);
    this.appendDummyInput()
        .appendField("PulseIn PIN#")
        .appendField(new Blockly.FieldDropdown(getDigitalPins()), "PIN")
        .appendField("Value")
        .appendField(new Blockly.FieldDropdown([["HIGH", "HIGH"], ["LOW", "LOW"]]), "VALUE");
    this.appendValueInput("TIMEOUT", 'Number')
        .appendField("Timeout (μs)")
        .setCheck('Number');
    this.setInputsInline(true);
    this.setOutput(true, 'Number');
    this.setTooltip('Measures the length of a pulse in microseconds');
  }
};

Blockly.Blocks['serial_print'] = {
  helpUrl: 'http://www.arduino.cc/en/Serial/Print',
  init: function() {
    this.setColour(230);
    this.appendValueInput("CONTENT", 'String')
        .appendField("Serial Print");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Prints data to the console/serial port as human-readable ASCII text.');
  }
};
