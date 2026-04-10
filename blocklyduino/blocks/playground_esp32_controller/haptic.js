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
 * @fileoverview Haptic Actuator blocks for ESP32-Controller.
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.haptic = {};

Blockly.Blocks['haptic_init'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField(i18n.t('categories.haptic'))
        .appendField(new Blockly.FieldImage("media/haptic.jpg", 64, 64))
        .appendField(i18n.t('blocks.hapticInit'));
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Initialize haptic actuator on GPIO 10');
  }
};

Blockly.Blocks['haptic_turn_on'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField(i18n.t('categories.haptic'))
        .appendField(new Blockly.FieldImage("media/haptic.jpg", 64, 64))
        .appendField(i18n.t('blocks.hapticTurnOn'));
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Turn haptic actuator ON');
  }
};

Blockly.Blocks['haptic_turn_off'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField(i18n.t('categories.haptic'))
        .appendField(new Blockly.FieldImage("media/haptic.jpg", 64, 64))
        .appendField(i18n.t('blocks.hapticTurnOff'));
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Turn haptic actuator OFF');
  }
};

Blockly.Blocks['haptic_vibrate'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField(i18n.t('categories.haptic'))
        .appendField(new Blockly.FieldImage("media/haptic.jpg", 64, 64))
        .appendField(i18n.t('blocks.hapticVibrate'));
    this.appendValueInput("DURATION", 'Number')
        .setCheck('Number')
        .appendField(i18n.t('blocks.hapticMs'));
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Vibrate for specified milliseconds (non-blocking)');
    this.setInputsInline(true);
  }
};
