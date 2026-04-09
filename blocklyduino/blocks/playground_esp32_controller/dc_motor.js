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
 * @fileoverview DC Motor blocks.
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.dc_motor = {};

Blockly.Blocks['dc_motor_init'] = {
  init: function() {
    this.setColour(30);
    this.appendDummyInput()
        .appendField("DC Motor")
        .appendField(new Blockly.FieldImage("media/motor.jpg", 64, 64))
        .appendField("Initialize");
    
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Motor1")
        .appendField(new Blockly.FieldCheckbox("TRUE"), "MOTOR1");
    
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Motor2")
        .appendField(new Blockly.FieldCheckbox("TRUE"), "MOTOR2");
    
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Motor3")
        .appendField(new Blockly.FieldCheckbox("TRUE"), "MOTOR3");
    
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Motor4")
        .appendField(new Blockly.FieldCheckbox("TRUE"), "MOTOR4");
    
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Initialize selected DC motors');
  }
};

Blockly.Blocks['dc_motor_set'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("DC Motor")
        .appendField(new Blockly.FieldImage("media/motor.jpg", 64, 64))
        .appendField("Motor#")
        .appendField(new Blockly.FieldDropdown([["Motor1", "1"], ["Motor2", "2"], ["Motor3", "3"], ["Motor4", "4"]]), "MOTOR")
        .appendField("Direction")
        .appendField(new Blockly.FieldDropdown([["Forward", "FORWARD"], ["Backward", "BACKWARD"]]), "DIRECTION");
    this.appendValueInput("SPEED", 'Number')
        .setCheck('Number')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Speed (0-100)");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Set DC motor direction and speed (0-100%)');
  }
};

Blockly.Blocks['dc_motor_stop'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("DC Motor")
        .appendField(new Blockly.FieldImage("media/motor.jpg", 64, 64))
        .appendField("Motor#")
        .appendField(new Blockly.FieldDropdown([["Motor1", "1"], ["Motor2", "2"], ["Motor3", "3"], ["Motor4", "4"]]), "MOTOR")
        .appendField("Stop");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Stop DC motor');
  }
};

Blockly.Blocks['dc_motor_test'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("DC Motor")
        .appendField(new Blockly.FieldImage("media/motor.jpg", 64, 64))
        .appendField("Test");
    
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Motor1")
        .appendField(new Blockly.FieldCheckbox("TRUE"), "MOTOR1");
    
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Motor2")
        .appendField(new Blockly.FieldCheckbox("TRUE"), "MOTOR2");
    
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Motor3")
        .appendField(new Blockly.FieldCheckbox("TRUE"), "MOTOR3");
    
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Motor4")
        .appendField(new Blockly.FieldCheckbox("TRUE"), "MOTOR4");
    
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Test selected DC motors');
  }
};
