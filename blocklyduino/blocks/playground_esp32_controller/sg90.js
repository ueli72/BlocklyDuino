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
 * @fileoverview SG90 Servo blocks.
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.sg90 = {};

function getSg90Pins() {
  var pins = [
    ["Servo1 (GPIO37)", "37"],
    ["Servo2 (GPIO38)", "38"],
    ["Servo3 (GPIO45)", "45"]
  ];
  if (typeof profile !== 'undefined' && profile.default && profile.default.digital) {
    pins = pins.concat(profile.default.digital);
  }
  return pins;
}

function getAllServoPins() {
  var pins = [
    ["none", "none"]
  ];
  // Add standard servo pins
  pins.push(["GPIO37 (Servo1)", "37"]);
  pins.push(["GPIO38 (Servo2)", "38"]);
  pins.push(["GPIO45 (Servo3)", "45"]);
  // Add all digital pins from profile if available
  if (typeof getBrumbrumDigitalPinOptions === 'function') {
    var digitalPins = getBrumbrumDigitalPinOptions();
    // Filter out the servo pins we already added
    digitalPins.forEach(function(pinOption) {
      var pinNum = pinOption[1];
      if (pinNum !== "37" && pinNum !== "38" && pinNum !== "45") {
        pins.push(pinOption);
      }
    });
  } else if (typeof profile !== 'undefined' && profile.default && profile.default.digital) {
    profile.default.digital.forEach(function(pinOption) {
      var pinNum = pinOption[1];
      if (pinNum !== "37" && pinNum !== "38" && pinNum !== "45") {
        pins.push(pinOption);
      }
    });
  }
  return pins;
}

Blockly.Blocks['servo_sg90_init'] = {
  helpUrl: 'http://www.arduino.cc/playground/ComponentLib/servo',
  init: function() {
    this.setColour(30);
    this.appendDummyInput()
        .appendField("SG90 Servo")
        .appendField(new Blockly.FieldImage("media/sg90.jpg", 64, 64))
        .appendField("Initialize");
    this.appendDummyInput()
        .appendField("Servo1 (GPIO37)")
        .appendField(new Blockly.FieldCheckbox("TRUE"), 'SERVO1');
    this.appendDummyInput()
        .appendField("Servo2 (GPIO38)")
        .appendField(new Blockly.FieldCheckbox("TRUE"), 'SERVO2');
    this.appendDummyInput()
        .appendField("Servo3 (GPIO45)")
        .appendField(new Blockly.FieldCheckbox("TRUE"), 'SERVO3');
    this.appendDummyInput()
        .appendField("Custom Pin:")
        .appendField(new Blockly.FieldDropdown(getAllServoPins), 'CUSTOM_PIN');
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Initialize selected SG90 servos and optional custom pin');
  }
};

Blockly.Blocks['servo_sg90_move'] = {
  helpUrl: 'http://www.arduino.cc/playground/ComponentLib/servo',
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("SG90 Servo")
        .appendField(new Blockly.FieldImage("media/sg90.jpg", 64, 64))
        .appendField("PIN#")
        .appendField(new Blockly.FieldDropdown(getSg90Pins), "PIN")
    this.appendValueInput("DEGREE", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Degree (0~180)");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('SG90 servo move between 0~180 degree');
  }
};

Blockly.Blocks['servo_sg90_read_degrees'] = {
  helpUrl: 'http://www.arduino.cc/playground/ComponentLib/servo',
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("SG90 Servo")
        .appendField(new Blockly.FieldImage("media/sg90.jpg", 64, 64))
        .appendField("PIN#")
        .appendField(new Blockly.FieldDropdown(getSg90Pins), "PIN");
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Read Degrees")
    this.setOutput(true, 'Number');
    this.setTooltip('return that degree with the last SG90 servo move.');
  }
};

Blockly.Blocks['servo_sg90_test_sweep'] = {
  helpUrl: 'http://www.arduino.cc/playground/ComponentLib/servo',
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("SG90 Servo")
        .appendField(new Blockly.FieldImage("media/sg90.jpg", 64, 64))
        .appendField("PIN#")
        .appendField(new Blockly.FieldDropdown(getSg90Pins), "PIN")
        .appendField("Test Sweep 180°");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Perform a full 180° sweep back and forward once');
  }
};
