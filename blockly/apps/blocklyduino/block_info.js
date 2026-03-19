var BLOCK_INFO = {
  'internal_led_init': {
    title: 'blockInfo.internalLED.title',
    message: 'blockInfo.internalLED.message',
    includes: ['internalLED.h']
  },
  'internal_led_set': {
    title: 'blockInfo.internalLED.title',
    message: 'blockInfo.internalLED.message',
    includes: ['internalLED.h']
  },
  'internal_led_off': {
    title: 'blockInfo.internalLED.title',
    message: 'blockInfo.internalLED.message',
    includes: ['internalLED.h']
  },
  'servo_sg90_init': {
    title: 'blockInfo.servo.title',
    message: 'blockInfo.servo.message',
    initMessage: 'blockInfo.servo.initMessage',
    includes: ['servos.h']
  },
  'servo_sg90_move': {
    title: 'blockInfo.servo.title',
    message: 'blockInfo.servo.message',
    moveMessage: 'blockInfo.servo.moveMessage',
    includes: ['servos.h']
  },
  'servo_sg90_read_degrees': {
    title: 'blockInfo.servo.title',
    message: 'blockInfo.servo.message',
    readMessage: 'blockInfo.servo.readMessage',
    includes: ['servos.h']
  }
};

var BLOCK_DEPENDENCIES = {
  'button_read': {
    requires: 'button_init',
    message: 'dependencies.buttonRead'
  },
  'servo_sg90_move': {
    requires: 'servo_sg90_init',
    message: 'dependencies.servoMove'
  },
  'servo_sg90_read_degrees': {
    requires: 'servo_sg90_init',
    message: 'dependencies.servoRead'
  },
  'internal_led_set': {
    requires: 'internal_led_init',
    message: 'dependencies.ledSet'
  },
  'internal_led_off': {
    requires: 'internal_led_init',
    message: 'dependencies.ledOff'
  },
  'led_matrix_set_pixel': {
    requires: 'led_matrix_init',
    message: 'dependencies.ledMatrixSetPixel'
  },
  'led_matrix_fill': {
    requires: 'led_matrix_init',
    message: 'dependencies.ledMatrixFill'
  },
  'led_matrix_show': {
    requires: 'led_matrix_init',
    message: 'dependencies.ledMatrixShow'
  },
  'led_matrix_off': {
    requires: 'led_matrix_init',
    message: 'dependencies.ledMatrixOff'
  }
};

var seenBlocks = new Set();

function getBlockInfo(blockType) {
  return BLOCK_INFO[blockType] || null;
}

function hasBlockInfo(blockType) {
  return BLOCK_INFO.hasOwnProperty(blockType);
}

function getRequiredIncludes() {
  var includes = new Set();
  var blocks = Blockly.mainWorkspace.getAllBlocks();
  
  for (var i = 0; i < blocks.length; i++) {
    var info = getBlockInfo(blocks[i].type);
    if (info && info.includes) {
      for (var j = 0; j < info.includes.length; j++) {
        includes.add(info.includes[j]);
      }
    }
  }
  
  return Array.from(includes);
}

function hasBlockDependency(blockType) {
  return BLOCK_DEPENDENCIES.hasOwnProperty(blockType);
}

function getBlockDependency(blockType) {
  return BLOCK_DEPENDENCIES[blockType] || null;
}

function checkDependencySatisfied(blockType) {
  var dep = getBlockDependency(blockType);
  if (!dep) return { satisfied: true };
  
  var blocks = Blockly.mainWorkspace.getAllBlocks();
  for (var i = 0; i < blocks.length; i++) {
    if (blocks[i].type === dep.requires) {
      return { satisfied: true };
    }
  }
  
  return { satisfied: false, message: dep.message, requires: dep.requires };
}

function checkAllDependencies() {
  var unsatisfied = [];
  var blocks = Blockly.mainWorkspace.getAllBlocks();
  var checkedBlocks = new Set();
  
  for (var i = 0; i < blocks.length; i++) {
    var blockType = blocks[i].type;
    if (hasBlockDependency(blockType) && !checkedBlocks.has(blockType)) {
      checkedBlocks.add(blockType);
      var result = checkDependencySatisfied(blockType);
      if (!result.satisfied) {
        unsatisfied.push(result);
      }
    }
  }
  
  return unsatisfied;
}
