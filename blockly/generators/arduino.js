/**
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * http://code.google.com/p/blockly/
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
 * @fileoverview Helper functions for generating Arduino for blocks.
 * @author gasolin@gmail.com (Fred Lin)
 */
'use strict';




/**
 * Arduino code generator.
 * @type !Blockly.Generator
 */
Blockly.Arduino = new Blockly.Generator('Arduino');

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.Arduino.addReservedWords(
  // http://arduino.cc/en/Reference/HomePage
  'setup,loop,if,else,for,switch,case,while,do,break,continue,return,goto,define,include,HIGH,LOW,INPUT,OUTPUT,INPUT_PULLUP,true,false,interger, constants,floating,point,void,bookean,char,unsigned,byte,int,word,long,float,double,string,String,array,static, volatile,const,sizeof,pinMode,digitalWrite,digitalRead,analogReference,analogRead,analogWrite,tone,noTone,shiftOut,shitIn,pulseIn,millis,micros,delay,delayMicroseconds,min,max,abs,constrain,map,pow,sqrt,sin,cos,tan,randomSeed,random,lowByte,highByte,bitRead,bitWrite,bitSet,bitClear,bit,attachInterrupt,detachInterrupt,interrupts,noInterrupts'
);

/**
 * Order of operation ENUMs.
 *
 */
Blockly.Arduino.ORDER_ATOMIC = 0;         // 0 "" ...
Blockly.Arduino.ORDER_UNARY_POSTFIX = 1;  // expr++ expr-- () [] .
Blockly.Arduino.ORDER_UNARY_PREFIX = 2;   // -expr !expr ~expr ++expr --expr
Blockly.Arduino.ORDER_MULTIPLICATIVE = 3; // * / % ~/
Blockly.Arduino.ORDER_ADDITIVE = 4;       // + -
Blockly.Arduino.ORDER_SHIFT = 5;          // << >>
Blockly.Arduino.ORDER_RELATIONAL = 6;     // is is! >= > <= <
Blockly.Arduino.ORDER_EQUALITY = 7;       // == != === !==
Blockly.Arduino.ORDER_BITWISE_AND = 8;    // &
Blockly.Arduino.ORDER_BITWISE_XOR = 9;    // ^
Blockly.Arduino.ORDER_BITWISE_OR = 10;    // |
Blockly.Arduino.ORDER_LOGICAL_AND = 11;   // &&
Blockly.Arduino.ORDER_LOGICAL_OR = 12;    // ||
Blockly.Arduino.ORDER_CONDITIONAL = 13;   // expr ? expr : expr
Blockly.Arduino.ORDER_ASSIGNMENT = 14;    // = *= /= ~/= %= += -= <<= >>= &= ^= |=
Blockly.Arduino.ORDER_NONE = 99;          // (...)

/*
 * Arduino Board profiles
 *
 */
var profile = {
  arduino: {
    description: "Arduino standard-compatible board",
    digital: [["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"], ["6", "6"], ["7", "7"], ["8", "8"], ["9", "9"], ["10", "10"], ["11", "11"], ["12", "12"], ["13", "13"], ["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]],
    analog: [["A0", "A0"], ["A1", "A1"], ["A2", "A2"], ["A3", "A3"], ["A4", "A4"], ["A5", "A5"]],
    serial: 9600
  },
  arduino_mega: {
    description: "Arduino Mega-compatible board"
    //53 digital
    //15 analog
  },
  esp32: {
    description: "ESP32 board",
    digital: [
      ["0", "0"], ["1", "1"], ["2", "2"], ["3", "3"], ["4", "4"], ["5", "5"],
      ["12", "12"], ["13", "13"], ["14", "14"], ["15", "15"], ["16", "16"],
      ["17", "17"], ["18", "18"], ["19", "19"], ["21", "21"], ["22", "22"],
      ["23", "23"], ["25", "25"], ["26", "26"], ["27", "27"], ["32", "32"],
      ["33", "33"], ["34", "34"], ["35", "35"], ["36", "36"], ["39", "39"]
    ],
    analog: [
      ["0", "0"], ["2", "2"], ["4", "4"], ["12", "12"], ["13", "13"],
      ["14", "14"], ["15", "15"], ["25", "25"], ["26", "26"], ["27", "27"],
      ["32", "32"], ["33", "33"], ["34", "34"], ["35", "35"], ["36", "36"], ["39", "39"]
    ],
    serial: 115200
  }
};
//set default profile to esp32 board
profile["default"] = profile["esp32"];
//alert(profile.default.digital[0]);

/**
 * Initialise the database of variable names.
 * @param {!Blockly.Workspace} workspace Workspace to generate code from.
 */
Blockly.Arduino.init = function(workspace) {
  // Create a dictionary of definitions to be printed before setups.
  Blockly.Arduino.definitions_ = Object.create(null);
  // Create a dictionary of setups to be printed before the code.
  Blockly.Arduino.setups_ = Object.create(null);
  // Create a dictionary of loop code to be printed in loop().
  Blockly.Arduino.loops_ = Object.create(null);
  // Create a dictionary to track already-generated blocks (prevents duplicates)
  Blockly.Arduino.generated_ = Object.create(null);

  if (!Blockly.Arduino.variableDB_) {
    Blockly.Arduino.variableDB_ =
        new Blockly.Names(Blockly.Arduino.RESERVED_WORDS_);
  } else {
    Blockly.Arduino.variableDB_.reset();
  }

  var defvars = [];
  var variables = Blockly.Variables.allVariables(workspace);
  for (var x = 0; x < variables.length; x++) {
    defvars[x] = 'int ' +
        Blockly.Arduino.variableDB_.getName(variables[x],
        Blockly.Variables.NAME_TYPE) + ';\n';
  }
  // Only add variables definition if there are variables
  if (defvars.length > 0) {
    Blockly.Arduino.definitions_['variables'] = defvars.join('\n');
  }
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.Arduino.finish = function(code) {
  // Find setup, loop, header, interrupts, and functions blocks in the workspace
  var setupBlock = null;
  var loopBlock = null;
  var headerBlock = null;
  var interruptsBlock = null;
  var functionsBlock = null;
  var blocks = Blockly.mainWorkspace.getAllBlocks();
  for (var i = 0; i < blocks.length; i++) {
    if (blocks[i].type === 'arduino_setup') {
      setupBlock = blocks[i];
    }
    if (blocks[i].type === 'arduino_loop') {
      loopBlock = blocks[i];
    }
    if (blocks[i].type === 'arduino_header') {
      headerBlock = blocks[i];
    }
    if (blocks[i].type === 'arduino_interrupts') {
      interruptsBlock = blocks[i];
    }
    if (blocks[i].type === 'arduino_functions') {
      functionsBlock = blocks[i];
    }
  }

  // Convert the definitions dictionary into a list.
  var imports = [];
  var definitions = [];
  for (var name in Blockly.Arduino.definitions_) {
    var def = Blockly.Arduino.definitions_[name];
    if (def && def.trim()) {
      if (def.match(/^#include/)) {
        imports.push(def);
      } else {
        definitions.push(def);
      }
    }
  }

  // Generate header code (user-placed includes, defines, global variables)
  var headerCode = '';
  if (headerBlock) {
    headerCode = Blockly.Arduino.statementToCode(headerBlock, 'HEADER_CODE');
  }

  // Generate interrupts code (timer and interrupt callbacks)
  // This must be called BEFORE converting setups_ to list
  var interruptsCode = '';
  if (interruptsBlock) {
    interruptsCode = Blockly.Arduino.statementToCode(interruptsBlock, 'INTERRUPTS_CODE');
  }

  // Generate functions code (user-defined functions)
  var functionsCode = '';
  if (functionsBlock) {
    functionsCode = Blockly.Arduino.statementToCode(functionsBlock, 'FUNCTIONS_CODE');
  }

  // Convert the setups dictionary into a list (AFTER generators have run)
  var setups = [];
  for (var name in Blockly.Arduino.setups_) {
    setups.push(Blockly.Arduino.setups_[name]);
  }

  // Generate setup function
  var setupCode = '';
  if (setupBlock) {
    setupCode = Blockly.Arduino.statementToCode(setupBlock, 'SETUP_CODE');
  }
  // Add setups_ code with proper indentation
  if (setups.length > 0) {
    var setupsCode = setups.join('\n');
    // Indent each line of the setups code
    setupsCode = setupsCode.replace(/\n/g, '\n  ');
    setupCode += '  ' + setupsCode + '\n';
  }

  // Generate loop function
  var loopCode = '';
  if (loopBlock) {
    loopCode = Blockly.Arduino.statementToCode(loopBlock, 'LOOP_CODE');
  } else {
    // Fallback to old behavior if no loop block
    code = '  ' + code.replace(/\n/g, '\n  ');
    code = code.replace(/\n\s+$/, '\n');
    loopCode = code;
  }
  
  // Convert the loops dictionary into a list
  var loops = [];
  for (var name in Blockly.Arduino.loops_) {
    loops.push(Blockly.Arduino.loops_[name]);
  }
  // Add loops_ code with proper indentation
  if (loops.length > 0) {
    var loopsCode = loops.join('\n');
    // Indent each line of the loops code
    loopsCode = loopsCode.replace(/\n/g, '\n  ');
    loopCode += '  ' + loopsCode + '\n';
  }

  var setupFunc = 'void setup() {\n  // Initialize hardware and peripherals\n' + setupCode + '}\n\n';
  var loopFunc = 'void loop() {\n  // Main program loop\n' + loopCode + '}\n';

  // Combine: header code (user) + auto-includes + auto-definitions + setup + loop
  var result = '';
  
  // Header block content (user-placed includes, defines, global variables)
  if (headerCode) {
    result += '// ============================================\n';
    result += '// Header - User-defined includes and globals\n';
    result += '// ============================================\n';
    result += headerCode + '\n';
  }
  
  // Auto-generated includes
  if (imports.length > 0) {
    result += '// ============================================\n';
    result += '// Includes - Auto-generated from blocks\n';
    result += '// ============================================\n';
    result += imports.join('\n') + '\n';
  }
  
  // Auto-generated definitions (global variables, objects)
  if (definitions.length > 0) {
    result += '\n// ============================================\n';
    result += '// Global Variables and Objects\n';
    result += '// ============================================\n';
    result += definitions.join('\n') + '\n';
  }
  
  // Interrupts block content (timer and interrupt callbacks)
  if (interruptsCode) {
    result += '\n// ============================================\n';
    result += '// Interrupt Handlers and Timer Callbacks\n';
    result += '// These functions are called automatically\n';
    result += '// by hardware interrupts or timers\n';
    result += '// ============================================\n';
    result += interruptsCode + '\n';
  }
  
  // Functions block content (user-defined functions)
  if (functionsCode) {
    result += '\n// ============================================\n';
    result += '// User-defined Functions\n';
    result += '// ============================================\n';
    result += functionsCode + '\n';
  }
  
  result += '\n// ============================================\n';
  result += '// Arduino Entry Points\n';
  result += '// ============================================\n\n';
  result += setupFunc + loopFunc;
  
  // Format code with AStyle.js if available
  if (typeof beautify === 'function') {
    try {
      result = beautify(result, 'kr', 2, 0);
    } catch (e) {
      // If formatting fails, return unformatted code
      console.warn('Code formatting failed:', e);
    }
  }
  
  return result;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.Arduino.scrubNakedValue = function(line) {
  return line + ';\n';
};

/**
 * Encode a string as a properly escaped Arduino string, complete with quotes.
 * @param {string} string Text to encode.
 * @return {string} Arduino string.
 * @private
 */
Blockly.Arduino.quote_ = function(string) {
  // TODO: This is a quick hack.  Replace with goog.string.quote
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/\$/g, '\\$')
                 .replace(/'/g, '\\\'');
  return '\"' + string + '\"';
};

/**
 * Common tasks for generating Arduino from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The Arduino code created for this block.
 * @return {string} Arduino code with comments and subsequent blocks added.
 * @private
 */
Blockly.Arduino.scrub_ = function(block, code) {
  if (code === null) {
    // Block has handled code generation itself.
    return '';
  }
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    if (comment) {
      commentCode += Blockly.Arduino.prefixLines(comment, '// ') + '\n';
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var x = 0; x < block.inputList.length; x++) {
      if (block.inputList[x].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[x].connection.targetBlock();
        if (childBlock) {
          var comment = Blockly.Arduino.allNestedComments(childBlock);
          if (comment) {
            commentCode += Blockly.Arduino.prefixLines(comment, '// ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = Blockly.Arduino.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};
