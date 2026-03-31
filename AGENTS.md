# BlocklyDuino Project Guide

## Project Overview
BlocklyDuino is a visual programming tool for Arduino, using Blockly to generate Arduino code.

## ⚠️ CRITICAL: Always Run generate_templates.py

**After ANY changes to board source files (`boards/esp32-s3-devkitc1/include/*.h` or `boards/esp32-s3-devkitc1/src/*.cpp`), you MUST run:**

```bash
python3 generate_templates.py
```

This regenerates `blocklyduino/templates.js` which is used for project downloads. **DO NOT edit templates.js manually!**

## Key Directories

### Block Definitions
- `blocklyduino/blocks/playground/*.js` - Block visual definitions for Playground components
- Each component has its own file (e.g., `oled.js`, `sg90.js`, `relais.js`)

### Code Generators
- `blocklyduino/generators/arduino/playground/*.js` - Arduino code generation for blocks
- Must match block definitions

### Main Application
- `blocklyduino/index.html` - Main HTML with toolbox definition and script includes
- `blocklyduino/block_info.js` - Block info, warnings, and dependencies
- `blocklyduino/lang/en.js` - English translations
- `blocklyduino/lang/de.js` - German translations
- `blocklyduino/templates.js` - Board templates (auto-generated, DO NOT EDIT)

### Board Source Files
- `boards/esp32-s3-devkitc1/include/*.h` - Header files
- `boards/esp32-s3-devkitc1/src/*.cpp` - Implementation files

### Media
- `blocklyduino/media/` - Images for blocks (64x64 recommended)

## Adding a New Block (e.g., "Relais")

### 1. Create Block Definition
File: `blocklyduino/blocks/playground/relais.js`
```javascript
Blockly.Blocks['relais_set'] = {
  init: function() {
    this.setColour(190);
    this.appendDummyInput()
        .appendField("Relais")
        .appendField(new Blockly.FieldImage("media/relais.jpg", 64, 64))
        .appendField("Relay#")
        .appendField(new Blockly.FieldDropdown([["Relay1", "1"], ["Relay2", "2"]]), "RELAY")
        .appendField("State")
        .appendField(new Blockly.FieldDropdown([["ON", "true"], ["OFF", "false"]]), "STATE");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setTooltip('Set relay state ON or OFF');
  }
};
```

### 2. Create Code Generator
File: `blocklyduino/generators/arduino/playground/relais.js`
```javascript
Blockly.Arduino.relais_set = function() {
  var dropdown_relay = this.getFieldValue('RELAY');
  var dropdown_state = this.getFieldValue('STATE');
  Blockly.Arduino.definitions_['include_relais_h'] = '#include "relais.h"\n';
  var code = 'setRelay(' + dropdown_relay + ', ' + dropdown_state + ');\n';
  return code;
};
```

### 3. Register in index.html
Add script includes:
```html
<script type="text/javascript" src="blocks/playground/relais.js"></script>
<script type="text/javascript" src="generators/arduino/playground/relais.js"></script>
```

Add to toolbox:
```xml
<category name="Relais" data-i18n-name="categories.relais">
  <block type="relais_set"></block>
  <block type="relais_test"></block>
</category>
```

Add subcategory detection in `addToolboxIcons()`:
```javascript
var relaisText = i18n.t('categories.relais');
var isSubcategory = text === sg90Text || ... || text === relaisText;
```

Add icon mapping:
```javascript
else if (text === relaisText) iconClass = 'bi-lightning-charge-fill';
```

### 4. Add Translations
In `lang/en.js`:
```javascript
"categories": {
  ...
  "relais": "Relais"
},
"blocks": {
  ...
  "relaisSet": "Set State",
  "relaisTest": "Test"
},
"blockInfo": {
  ...
  "relais": {
    "title": "Relais",
    "message": "Relais need an external powersource of 5V to work.",
    "testMessage": "This block tests both relays..."
  }
},
"dependencies": {
  ...
  "relaisSet": "Relais must be initialized before setting state.",
  "relaisTest": "Relais must be initialized before running test."
}
```

### 5. Add Block Info and Dependencies
In `block_info.js`:
```javascript
var BLOCK_INFO = {
  ...
  'relais_set': {
    title: 'blockInfo.relais.title',
    message: 'blockInfo.relais.message',
    includes: ['relais.h']
  },
  'relais_test': {
    title: 'blockInfo.relais.title',
    message: 'blockInfo.relais.message',
    testMessage: 'blockInfo.relais.testMessage',
    includes: ['relais.h']
  }
};

var BLOCK_DEPENDENCIES = {
  ...
  // No dependencies for relais - pinMode is set in setRelay()
};
```

### 6. Add Source Files
- `boards/esp32-s3-devkitc1/include/relais.h`
- `boards/esp32-s3-devkitc1/src/relais.cpp`

### 7. Regenerate Templates
```bash
python3 generate_templates.py
```

## Important Commands

### Regenerate templates.js
```bash
python3 generate_templates.py
```
**ALWAYS run this after modifying board source files!**

## Bootstrap Icons
Available icons: https://icons.getbootstrap.com
Usage: `iconClass = 'bi-icon-name'`

## Block Colors
- 190 = Blue (Playground components)

## Common Patterns

### Block with Dropdown
```javascript
.appendField(new Blockly.FieldDropdown([["ON", "true"], ["OFF", "false"]]), "STATE")
```

### Block with Value Input
```javascript
this.appendValueInput("DEGREE", 'Number')
    .setCheck('Number')
    .appendField("Degree");
```

### Include Header in Generator
```javascript
Blockly.Arduino.definitions_['include_relais_h'] = '#include "relais.h"\n';
```

## File Naming Conventions
- Block files: lowercase (e.g., `relais.js`)
- Header/Source: lowercase (e.g., `relais.h`, `relais.cpp`)
- Block types: underscore (e.g., `relais_init`, `relais_set`)
