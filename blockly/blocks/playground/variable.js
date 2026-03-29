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
 * @fileoverview Variable declaration and access blocks.
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.variable = {};

var variableDropdownGenerator = function() {
  var names = [["myVar", "myVar"]];
  try {
    if (Blockly.mainWorkspace) {
      var blocks = Blockly.mainWorkspace.getAllBlocks();
      var foundNames = [];
      for (var i = 0; i < blocks.length; i++) {
        if (blocks[i].type === 'global_variable') {
          var name = blocks[i].getFieldValue('NAME');
          if (name && foundNames.indexOf(name) === -1) {
            foundNames.push(name);
          }
        }
      }
      if (foundNames.length > 0) {
        names = [];
        for (var j = 0; j < foundNames.length; j++) {
          names.push([foundNames[j], foundNames[j]]);
        }
      }
    }
  } catch (e) {
    // Ignore errors during initialization
  }
  return names;
};

var variableRenameHandler = function(oldName, newName) {
  if (!Blockly.mainWorkspace || oldName === newName) return;
  
  try {
    var blocks = Blockly.mainWorkspace.getAllBlocks();
    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      if (block.type === 'global_variable_get' || block.type === 'global_variable_set') {
        if (block.getFieldValue('NAME') === oldName) {
          block.setFieldValue(newName, 'NAME');
        }
      }
    }
  } catch (e) {
    // Ignore errors
  }
};

Blockly.Blocks['global_variable'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("Declare")
        .appendField(new Blockly.FieldCheckbox("FALSE"), "VOLATILE")
        .appendField("volatile");
    
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("type")
        .appendField(new Blockly.FieldDropdown([
          ["int", "int"],
          ["byte", "byte"],
          ["long", "long"],
          ["float", "float"],
          ["bool", "bool"],
          ["char*", "char*"],
          ["String", "String"]
        ]), "TYPE");
    
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("name")
        .appendField(new Blockly.FieldTextInput("myVar"), "NAME");
    
    this.appendValueInput("VALUE")
        .setAlign(Blockly.ALIGN_RIGHT)
        .setCheck(null)
        .appendField("initial value");
    
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip('Declare a variable. Use volatile for variables shared with interrupts/timers.');
    
    this.oldName_ = "myVar";
  },
  
  onchange: function() {
    if (!Blockly.mainWorkspace) return;
    
    try {
      var newName = this.getFieldValue('NAME');
      if (this.oldName_ && this.oldName_ !== newName) {
        variableRenameHandler(this.oldName_, newName);
      }
      this.oldName_ = newName;
    } catch (e) {
      // Ignore errors
    }
  }
};

Blockly.Blocks['global_variable_get'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("Get")
        .appendField(new Blockly.FieldDropdown(variableDropdownGenerator), "NAME");
    this.setOutput(true, null);
    this.setTooltip('Get the value of a variable');
  }
};

Blockly.Blocks['global_variable_set'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("Set")
        .appendField(new Blockly.FieldDropdown(variableDropdownGenerator), "NAME");
    this.appendValueInput("VALUE")
        .setCheck(null)
        .appendField("to");
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Set the value of a variable');
  }
};
