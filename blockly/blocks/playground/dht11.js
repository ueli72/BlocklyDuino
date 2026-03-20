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
 * @fileoverview DHT11 temperature and humidity sensor blocks.
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.dht11 = {};

Blockly.Blocks['dht11_init'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("DHT11 Sensor")
        .appendField(new Blockly.FieldImage("../../media/dht11.jpg", 64, 64))
        .appendField("Initialize");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Initialize the DHT11 temperature and humidity sensor');
  }
};

Blockly.Blocks['dht11_read_temp'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("DHT11 Sensor")
        .appendField(new Blockly.FieldImage("../../media/dht11.jpg", 64, 64))
        .appendField("Read Temperature");
    this.setOutput(true, 'Number');
    this.setTooltip('Read temperature from DHT11 sensor in Celsius');
  }
};

Blockly.Blocks['dht11_read_humidity'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("DHT11 Sensor")
        .appendField(new Blockly.FieldImage("../../media/dht11.jpg", 64, 64))
        .appendField("Read Humidity");
    this.setOutput(true, 'Number');
    this.setTooltip('Read humidity from DHT11 sensor in percent');
  }
};

Blockly.Blocks['dht11_test'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("DHT11 Sensor")
        .appendField(new Blockly.FieldImage("../../media/dht11.jpg", 64, 64))
        .appendField("Test");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Test the DHT11 sensor and display values on OLED');
  }
};
