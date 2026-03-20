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
  'internal_led_test': {
    title: 'blockInfo.internalLED.title',
    message: 'blockInfo.internalLED.message',
    testMessage: 'blockInfo.internalLED.testMessage',
    includes: ['internalLED.h']
  },
  'oled_init': {
    title: 'blockInfo.oled.title',
    message: 'blockInfo.oled.message',
    includes: ['oled.h']
  },
  'oled_write': {
    title: 'blockInfo.oled.title',
    message: 'blockInfo.oled.message',
    includes: ['oled.h']
  },
  'oled_clear': {
    title: 'blockInfo.oled.title',
    message: 'blockInfo.oled.message',
    includes: ['oled.h']
  },
  'oled_test': {
    title: 'blockInfo.oled.title',
    message: 'blockInfo.oled.message',
    testMessage: 'blockInfo.oled.testMessage',
    includes: ['oled.h']
  },
  'led_matrix_init': {
    title: 'blockInfo.ledMatrix.title',
    message: 'blockInfo.ledMatrix.message',
    includes: ['LEDMatrix.h']
  },
  'led_matrix_set_pixel': {
    title: 'blockInfo.ledMatrix.title',
    message: 'blockInfo.ledMatrix.message',
    includes: ['LEDMatrix.h']
  },
  'led_matrix_fill': {
    title: 'blockInfo.ledMatrix.title',
    message: 'blockInfo.ledMatrix.message',
    includes: ['LEDMatrix.h']
  },
  'led_matrix_show': {
    title: 'blockInfo.ledMatrix.title',
    message: 'blockInfo.ledMatrix.message',
    includes: ['LEDMatrix.h']
  },
  'led_matrix_off': {
    title: 'blockInfo.ledMatrix.title',
    message: 'blockInfo.ledMatrix.message',
    includes: ['LEDMatrix.h']
  },
  'led_matrix_test': {
    title: 'blockInfo.ledMatrix.title',
    message: 'blockInfo.ledMatrix.message',
    testMessage: 'blockInfo.ledMatrix.testMessage',
    includes: ['LEDMatrix.h']
  },
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
  },
  'dc_motor_init': {
    title: 'blockInfo.dcMotor.title',
    message: 'blockInfo.dcMotor.message',
    includes: ['dcmotor.h']
  },
  'dc_motor_set': {
    title: 'blockInfo.dcMotor.title',
    message: 'blockInfo.dcMotor.message',
    includes: ['dcmotor.h']
  },
  'dc_motor_stop': {
    title: 'blockInfo.dcMotor.title',
    message: 'blockInfo.dcMotor.message',
    includes: ['dcmotor.h']
  },
  'dc_motor_test': {
    title: 'blockInfo.dcMotor.title',
    message: 'blockInfo.dcMotor.message',
    testMessage: 'blockInfo.dcMotor.testMessage',
    includes: ['dcmotor.h']
  },
  'dht11_init': {
    title: 'blockInfo.dht11.title',
    message: 'blockInfo.dht11.message',
    warningKey: 'dht11',
    includes: ['dht11.h']
  },
  'dht11_read_temp': {
    title: 'blockInfo.dht11.title',
    message: 'blockInfo.dht11.message',
    warningKey: 'dht11',
    includes: ['dht11.h']
  },
  'dht11_read_humidity': {
    title: 'blockInfo.dht11.title',
    message: 'blockInfo.dht11.message',
    warningKey: 'dht11',
    includes: ['dht11.h']
  },
  'dht11_test': {
    title: 'blockInfo.dht11.title',
    message: 'blockInfo.dht11.message',
    warningKey: 'dht11',
    testMessage: 'blockInfo.dht11.testMessage',
    includes: ['dht11.h', 'oled.h']
  },
  'ultrasonic_read': {
    includes: ['ultrasonic.h']
  },
  'ultrasonic_test': {
    includes: ['ultrasonic.h', 'oled.h']
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
  'servo_sg90_test_sweep': {
    requires: 'servo_sg90_init',
    message: 'dependencies.servoTestSweep'
  },
  'internal_led_set': {
    requires: 'internal_led_init',
    message: 'dependencies.ledSet'
  },
  'internal_led_off': {
    requires: 'internal_led_init',
    message: 'dependencies.ledOff'
  },
  'internal_led_test': {
    requires: 'internal_led_init',
    message: 'dependencies.ledTest'
  },
  'oled_write': {
    requires: 'oled_init',
    message: 'dependencies.oledWrite'
  },
  'oled_clear': {
    requires: 'oled_init',
    message: 'dependencies.oledClear'
  },
  'oled_test': {
    requires: 'oled_init',
    message: 'dependencies.oledTest'
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
  },
  'led_matrix_test': {
    requires: 'led_matrix_init',
    message: 'dependencies.ledMatrixTest'
  },
  'dc_motor_set': {
    requires: 'dc_motor_init',
    message: 'dependencies.dcMotorSet'
  },
  'dc_motor_stop': {
    requires: 'dc_motor_init',
    message: 'dependencies.dcMotorStop'
  },
  'dc_motor_test': {
    requires: 'dc_motor_init',
    message: 'dependencies.dcMotorTest'
  },
  'dht11_read_temp': {
    requires: 'dht11_init',
    message: 'dependencies.dht11ReadTemp'
  },
  'dht11_read_humidity': {
    requires: 'dht11_init',
    message: 'dependencies.dht11ReadHumidity'
  },
  'dht11_test': {
    requires: 'dht11_init',
    message: 'dependencies.dht11Test'
  }
};

var seenBlocks = {
  _data: null,
  _init: function() {
    if (this._data === null) {
      try {
        this._data = JSON.parse(sessionStorage.getItem('seenBlocks') || '[]');
      } catch (e) {
        this._data = [];
      }
    }
  },
  has: function(blockType) {
    this._init();
    return this._data.indexOf(blockType) !== -1;
  },
  add: function(blockType) {
    this._init();
    if (this._data.indexOf(blockType) === -1) {
      this._data.push(blockType);
      try {
        sessionStorage.setItem('seenBlocks', JSON.stringify(this._data));
      } catch (e) {}
    }
  }
};

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
