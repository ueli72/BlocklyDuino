var BLOCK_INFO = {
  'internal_led_init': {
    title: 'Internal RGB LED',
    message: 'Be careful. On the DEV-Board there is a solderable jumper that needs to be connected to make the internal RGB-LED work.',
    includes: ['internalLED.h']
  },
  'internal_led_set': {
    title: 'Internal RGB LED',
    message: 'Be careful. On the DEV-Board there is a solderable jumper that needs to be connected to make the internal RGB-LED work.',
    includes: ['internalLED.h']
  },
  'internal_led_off': {
    title: 'Internal RGB LED',
    message: 'Be careful. On the DEV-Board there is a solderable jumper that needs to be connected to make the internal RGB-LED work.',
    includes: ['internalLED.h']
  },
  'servo_sg90_init': {
    title: 'SG90 Servo',
    message: 'The servos only work with an external power-source of 5 to 6 volts.\n\nThis block initializes all 3 SG90 servos.\n\nPins used:\n• Servo1: GPIO37\n• Servo2: GPIO38\n• Servo3: GPIO45',
    includes: ['servos.h']
  },
  'servo_sg90_move': {
    title: 'SG90 Servo',
    message: 'The servos only work with an external power-source of 5 to 6 volts.\n\nThis block moves a servo to a specific angle (0-180 degrees).',
    includes: ['servos.h']
  },
  'servo_sg90_read_degrees': {
    title: 'SG90 Servo',
    message: 'The servos only work with an external power-source of 5 to 6 volts.\n\nThis block reads the current angle of a servo.',
    includes: ['servos.h']
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
