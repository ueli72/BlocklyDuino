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
 * @fileoverview Test All block with interactive menu.
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.test_all = {};

Blockly.Blocks['test_all'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("Test All")
        .appendField(new Blockly.FieldImage("media/test_all.jpg", 64, 64))
        .appendField(" (Interactive Menu)");
    
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("LED Matrix")
        .appendField(new Blockly.FieldCheckbox("TRUE"), "LED_MATRIX");
    
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Relais")
        .appendField(new Blockly.FieldCheckbox("TRUE"), "RELAIS");
    
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("DC Motor")
        .appendField(new Blockly.FieldCheckbox("TRUE"), "DC_MOTOR");
    
    
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Ultrasonic")
        .appendField(new Blockly.FieldCheckbox("TRUE"), "ULTRASONIC");
    
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("SD Card")
        .appendField(new Blockly.FieldCheckbox("TRUE"), "SD_CARD");
    
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("MAX98357A")
        .appendField(new Blockly.FieldCheckbox("TRUE"), "MAX98357A");
    
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Internal LED")
        .appendField(new Blockly.FieldCheckbox("TRUE"), "INTERNAL_LED");
    
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("SG90 Servo")
        .appendField(new Blockly.FieldCheckbox("TRUE"), "SG90_SERVO");
    
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Run interactive test menu for selected components. Use SW1 to navigate (hold to exit) and SW2 to run/back.');
  }
};
