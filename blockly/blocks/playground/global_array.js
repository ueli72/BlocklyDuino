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
 * @fileoverview Global Array declaration and access blocks.
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.global_array = {};

var globalArrayDropdownGenerator = function() {
  var names = [["myArray", "myArray"]];
  try {
    if (Blockly.mainWorkspace) {
      var blocks = Blockly.mainWorkspace.getAllBlocks();
      var foundNames = [];
      for (var i = 0; i < blocks.length; i++) {
        if (blocks[i].type === 'global_array') {
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
  }
  return names;
};

var globalArrayRenameHandler = function(oldName, newName) {
  if (!Blockly.mainWorkspace || oldName === newName) return;
  
  try {
    var blocks = Blockly.mainWorkspace.getAllBlocks();
    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      if (block.type === 'global_array_get' || 
          block.type === 'global_array_set' ||
          block.type === 'global_array_length' ||
          block.type === 'global_array_fill') {
        if (block.getFieldValue('NAME') === oldName) {
          block.setFieldValue(newName, 'NAME');
        }
      }
    }
  } catch (e) {
  }
};

Blockly.Blocks['global_array'] = {
  init: function() {
    this.setColour(330);
    this.appendDummyInput()
        .appendField("Create Array")
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
          ["char", "char"]
        ]), "TYPE");
    
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("name")
        .appendField(new Blockly.FieldTextInput("myArray"), "NAME");
    
    this.appendValueInput("SIZE")
        .setAlign(Blockly.ALIGN_RIGHT)
        .setCheck("Number")
        .appendField("size");
    
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Declare a global array. Use volatile for arrays shared with interrupts/timers.');
    
    this.oldName_ = "myArray";
  },
  
  onchange: function() {
    if (!Blockly.mainWorkspace) return;
    
    try {
      var newName = this.getFieldValue('NAME');
      if (this.oldName_ && this.oldName_ !== newName) {
        globalArrayRenameHandler(this.oldName_, newName);
      }
      this.oldName_ = newName;
    } catch (e) {
    }
  }
};

Blockly.Blocks['global_array_get'] = {
  init: function() {
    this.setColour(330);
    this.appendDummyInput()
        .appendField("Get")
        .appendField(new Blockly.FieldDropdown(globalArrayDropdownGenerator), "NAME");
    this.appendValueInput("INDEX")
        .setCheck("Number")
        .appendField("[");
    this.appendDummyInput()
        .appendField("]");
    this.setOutput(true, null);
    this.setInputsInline(true);
    this.setTooltip('Get array element at index');
  }
};

Blockly.Blocks['global_array_set'] = {
  init: function() {
    this.setColour(330);
    this.appendDummyInput()
        .appendField("Set")
        .appendField(new Blockly.FieldDropdown(globalArrayDropdownGenerator), "NAME");
    this.appendValueInput("INDEX")
        .setCheck("Number")
        .appendField("[");
    this.appendDummyInput()
        .appendField("]");
    this.appendValueInput("VALUE")
        .setCheck(null)
        .appendField("=");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setInputsInline(true);
    this.setTooltip('Set array element at index');
  }
};

Blockly.Blocks['global_array_length'] = {
  init: function() {
    this.setColour(330);
    this.appendDummyInput()
        .appendField("Length")
        .appendField(new Blockly.FieldDropdown(globalArrayDropdownGenerator), "NAME");
    this.setOutput(true, "Number");
    this.setTooltip('Get array length');
  }
};

Blockly.Blocks['global_array_fill'] = {
  init: function() {
    this.setColour(330);
    this.appendDummyInput()
        .appendField("Fill")
        .appendField(new Blockly.FieldDropdown(globalArrayDropdownGenerator), "NAME");
    this.appendValueInput("VALUE")
        .setCheck(null)
        .appendField("with");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setInputsInline(true);
    this.setTooltip('Fill array with value');
  }
};
