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
 * @fileoverview Custom Code blocks for writing raw C/C++ code.
 */
'use strict';

Blockly.Blocks = Blockly.Blocks || {};
Blockly.Blocks.custom_code = {};

var CustomCodeEditor = {
  open: function(title, currentValue, callback) {
    var overlay = document.createElement('div');
    overlay.id = 'custom-code-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);z-index:2147483647;display:flex;align-items:center;justify-content:center;';
    
    var container = document.createElement('div');
    container.style.cssText = 'background:#fff;padding:20px;border-radius:8px;min-width:450px;box-shadow:0 4px 20px rgba(0,0,0,0.3);';
    
    var header = document.createElement('div');
    header.style.cssText = 'font-weight:bold;font-size:16px;margin-bottom:12px;color:#333;';
    header.textContent = title;
    container.appendChild(header);
    
    var textarea = document.createElement('textarea');
    textarea.style.cssText = 'width:100%;height:180px;font-family:monospace;font-size:13px;padding:10px;border:1px solid #ccc;border-radius:4px;box-sizing:border-box;resize:vertical;';
    textarea.value = currentValue || '';
    container.appendChild(textarea);
    
    var btnContainer = document.createElement('div');
    btnContainer.style.cssText = 'margin-top:15px;text-align:right;';
    
    var cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.cssText = 'padding:8px 16px;margin-right:8px;cursor:pointer;border:1px solid #ccc;background:#f5f5f5;border-radius:4px;';
    cancelBtn.onclick = function() {
      document.body.removeChild(overlay);
    };
    btnContainer.appendChild(cancelBtn);
    
    var okBtn = document.createElement('button');
    okBtn.textContent = 'OK';
    okBtn.style.cssText = 'padding:8px 16px;cursor:pointer;background:#4CAF50;color:#fff;border:none;border-radius:4px;';
    okBtn.onclick = function() {
      callback(textarea.value);
      document.body.removeChild(overlay);
    };
    btnContainer.appendChild(okBtn);
    
    container.appendChild(btnContainer);
    overlay.appendChild(container);
    document.body.appendChild(overlay);
    
    textarea.focus();
    textarea.select();
    
    return overlay;
  }
};

Blockly.Blocks['custom_code_statement'] = {
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendField("Custom Code")
        .appendField(new Blockly.FieldLabel("✏️"), "EDIT_BTN");
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabel("digitalWrite(13, HIGH);"), "CODE_DISPLAY");
    this.code_ = "digitalWrite(13, HIGH);";
    this.setPreviousStatement(true, "general");
    this.setNextStatement(true, "general");
    this.setTooltip('Write custom C/C++ code. Click [Edit] to edit.');
  },
  getFieldValue: function(name) {
    if (name === 'CODE') return this.code_;
    return Blockly.Blocks['custom_code_statement'].superClass_.getFieldValue.call(this, name);
  },
  setFieldValue: function(value, name) {
    if (name === 'CODE') {
      this.code_ = value;
      var firstLine = value.split('\n')[0];
      var hasMoreLines = value.includes('\n');
      var display = firstLine.length > 40 ? firstLine.substring(0, 37) + '...' : firstLine;
      if (hasMoreLines) display += ' [...]';
      this.getField('CODE_DISPLAY').setText(display);
    } else {
      Blockly.Blocks['custom_code_statement'].superClass_.setFieldValue.call(this, value, name);
    }
  },
  onchange: function() {
    if (this.editorInitialized_) return;
    this.editorInitialized_ = true;
    
    var block = this;
    setTimeout(function() {
      var editField = block.getField('EDIT_BTN');
      if (editField) {
        var svgRoot = editField.getSvgRoot ? editField.getSvgRoot() : editField.fieldGroup_;
        if (svgRoot) {
          svgRoot.style.cursor = 'pointer';
          svgRoot.addEventListener('mousedown', function(evt) {
            CustomCodeEditor.open('Edit Custom Code', block.code_, function(newValue) {
              block.setFieldValue(newValue, 'CODE');
            });
          });
        }
      }
    }, 100);
  }
};

Blockly.Blocks['custom_code_expression'] = {
  init: function() {
    this.setColour(290);
    this.appendDummyInput()
        .appendField("Custom Expression")
        .appendField(new Blockly.FieldLabel("✏️"), "EDIT_BTN");
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabel("analogRead(A0)"), "CODE_DISPLAY");
    this.code_ = "analogRead(A0)";
    this.setOutput(true, null);
    this.setTooltip('Write custom C/C++ expression. Click [Edit] to edit.');
  },
  getFieldValue: function(name) {
    if (name === 'CODE') return this.code_;
    return Blockly.Blocks['custom_code_expression'].superClass_.getFieldValue.call(this, name);
  },
  setFieldValue: function(value, name) {
    if (name === 'CODE') {
      this.code_ = value;
      var firstLine = value.split('\n')[0];
      var hasMoreLines = value.includes('\n');
      var display = firstLine.length > 40 ? firstLine.substring(0, 37) + '...' : firstLine;
      if (hasMoreLines) display += ' [...]';
      this.getField('CODE_DISPLAY').setText(display);
    } else {
      Blockly.Blocks['custom_code_expression'].superClass_.setFieldValue.call(this, value, name);
    }
  },
  onchange: function() {
    if (this.editorInitialized_) return;
    this.editorInitialized_ = true;
    
    var block = this;
    setTimeout(function() {
      var editField = block.getField('EDIT_BTN');
      if (editField) {
        var svgRoot = editField.getSvgRoot ? editField.getSvgRoot() : editField.fieldGroup_;
        if (svgRoot) {
          svgRoot.style.cursor = 'pointer';
          svgRoot.addEventListener('mousedown', function(evt) {
            CustomCodeEditor.open('Edit Custom Expression', block.code_, function(newValue) {
              block.setFieldValue(newValue, 'CODE');
            });
          });
        }
      }
    }, 100);
  }
};

Blockly.Blocks['custom_code_include'] = {
  init: function() {
    this.setColour(300);
    this.appendDummyInput()
        .appendField("Custom Include/Define")
        .appendField(new Blockly.FieldLabel("✏️"), "EDIT_BTN");
    this.appendDummyInput()
        .appendField(new Blockly.FieldLabel("#include <WiFi.h>"), "CODE_DISPLAY");
    this.code_ = "#include <WiFi.h>";
    this.setPreviousStatement(true, "header");
    this.setNextStatement(true, "header");
    this.setTooltip('Write custom includes or defines. Click [Edit] to edit.');
  },
  getFieldValue: function(name) {
    if (name === 'CODE') return this.code_;
    return Blockly.Blocks['custom_code_include'].superClass_.getFieldValue.call(this, name);
  },
  setFieldValue: function(value, name) {
    if (name === 'CODE') {
      this.code_ = value;
      var firstLine = value.split('\n')[0];
      var hasMoreLines = value.includes('\n');
      var display = firstLine.length > 40 ? firstLine.substring(0, 37) + '...' : firstLine;
      if (hasMoreLines) display += ' [...]';
      this.getField('CODE_DISPLAY').setText(display);
    } else {
      Blockly.Blocks['custom_code_include'].superClass_.setFieldValue.call(this, value, name);
    }
  },
  onchange: function() {
    if (this.editorInitialized_) return;
    this.editorInitialized_ = true;
    
    var block = this;
    setTimeout(function() {
      var editField = block.getField('EDIT_BTN');
      if (editField) {
        var svgRoot = editField.getSvgRoot ? editField.getSvgRoot() : editField.fieldGroup_;
        if (svgRoot) {
          svgRoot.style.cursor = 'pointer';
          svgRoot.addEventListener('mousedown', function(evt) {
            CustomCodeEditor.open('Edit Include/Define', block.code_, function(newValue) {
              block.setFieldValue(newValue, 'CODE');
            });
          });
        }
      }
    }, 100);
  }
};
