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
  'internal_led_test': {
    title: 'blockInfo.internalLED.title',
    message: 'blockInfo.internalLED.message',
    testMessage: 'blockInfo.internalLED.testMessage',
    includes: ['internalLED.h']
  },
  'esp32_controller_led_init': {
    title: 'blockInfo.internalLED.title',
    message: 'blockInfo.internalLED.message',
    includes: ['internalLED.h']
  },
  'esp32_controller_led_set': {
    title: 'blockInfo.internalLED.title',
    message: 'blockInfo.internalLED.message',
    includes: ['internalLED.h']
  },
  'button_interrupt': {
    title: 'blockInfo.button.title',
    message: 'blockInfo.button.interruptMessage',
    warningKey: 'interrupt',
    includes: []
  },
  'external_interrupt': {
    title: 'blockInfo.externalInterrupt.title',
    message: 'blockInfo.externalInterrupt.message',
    warningKey: 'external_interrupt',
    includes: []
  },
  'button_init': {
    title: 'blockInfo.button.title',
    message: 'blockInfo.button.initMessage',
    includes: ['buttons.h']
  },
  'button_test': {
    title: 'blockInfo.button.title',
    message: 'blockInfo.button.initMessage',
    testMessage: 'blockInfo.button.testMessage',
    includes: ['buttons.h', 'oled.h']
  },
  // BrumBrum-specific button blocks (only 2 buttons)
  'button_init_brumbrum': {
    title: 'blockInfo.buttonBrumbrum.title',
    message: 'blockInfo.buttonBrumbrum.initMessage',
    includes: ['buttons.h']
  },
  'button_test_brumbrum': {
    title: 'blockInfo.buttonBrumbrum.title',
    message: 'blockInfo.buttonBrumbrum.initMessage',
    testMessage: 'blockInfo.buttonBrumbrum.testMessage',
    includes: ['buttons.h', 'oled.h']
  },
  // ESP32-Controller specific button blocks (4 extra buttons)
  'button_init_esp32_controller': {
    title: 'blockInfo.buttonEsp32Controller.title',
    message: 'blockInfo.buttonEsp32Controller.initMessage',
    includes: ['buttons.h']
  },
  'button_test_esp32_controller': {
    title: 'blockInfo.buttonEsp32Controller.title',
    message: 'blockInfo.buttonEsp32Controller.initMessage',
    testMessage: 'blockInfo.buttonEsp32Controller.testMessage',
    includes: ['buttons.h', 'oled.h']
  },
  'async_timer': {
    title: 'blockInfo.timer.title',
    message: 'blockInfo.timer.message',
    includes: []
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
    title: 'blockInfo.ultrasonic.title',
    message: 'blockInfo.ultrasonic.message',
    warningKey: 'ultrasonic',
    includes: ['ultrasonic.h']
  },
  'ultrasonic_test': {
    title: 'blockInfo.ultrasonic.title',
    message: 'blockInfo.ultrasonic.message',
    warningKey: 'ultrasonic',
    testMessage: 'blockInfo.ultrasonic.testMessage',
    includes: ['ultrasonic.h', 'oled.h']
  },
  'sdcard_init': {
    title: 'blockInfo.sdcard.title',
    message: 'blockInfo.sdcard.message',
    warningKey: 'sdcard',
    includes: ['sdcard.h']
  },
  'sdcard_write': {
    title: 'blockInfo.sdcard.title',
    message: 'blockInfo.sdcard.message',
    warningKey: 'sdcard',
    includes: ['sdcard.h']
  },
  'sdcard_read': {
    title: 'blockInfo.sdcard.title',
    message: 'blockInfo.sdcard.message',
    warningKey: 'sdcard',
    includes: ['sdcard.h']
  },
  'sdcard_append': {
    title: 'blockInfo.sdcard.title',
    message: 'blockInfo.sdcard.message',
    warningKey: 'sdcard',
    includes: ['sdcard.h']
  },
  'sdcard_exists': {
    title: 'blockInfo.sdcard.title',
    message: 'blockInfo.sdcard.message',
    warningKey: 'sdcard',
    includes: ['sdcard.h']
  },
  'sdcard_delete': {
    title: 'blockInfo.sdcard.title',
    message: 'blockInfo.sdcard.message',
    warningKey: 'sdcard',
    includes: ['sdcard.h']
  },
  'sdcard_test': {
    title: 'blockInfo.sdcard.title',
    message: 'blockInfo.sdcard.message',
    warningKey: 'sdcard',
    testMessage: 'blockInfo.sdcard.testMessage',
    includes: ['sdcard.h', 'oled.h']
  },
  'max98357a_init': {
    title: 'blockInfo.max98357a.title',
    message: 'blockInfo.max98357a.message',
    includes: ['max98357a.h']
  },
  'max98357a_play_tone': {
    title: 'blockInfo.max98357a.title',
    message: 'blockInfo.max98357a.message',
    includes: ['max98357a.h']
  },
  'max98357a_stop': {
    title: 'blockInfo.max98357a.title',
    message: 'blockInfo.max98357a.message',
    includes: ['max98357a.h']
  },
  'max98357a_test': {
    title: 'blockInfo.max98357a.title',
    message: 'blockInfo.max98357a.testWarning',
    warningKey: 'max98357a_test_wav',
    testMessage: 'blockInfo.max98357a.testMessage',
    includes: ['max98357a.h', 'oled.h']
  },
  'max98357a_play_file': {
    title: 'blockInfo.max98357a.title',
    message: 'blockInfo.max98357a.playFileMessage',
    warningKey: 'max98357a_play_file',
    includes: ['max98357a.h', 'sdcard.h']
  },
  'max98357a_is_playing': {
    title: 'blockInfo.max98357a.title',
    message: 'blockInfo.max98357a.isPlayingMessage',
    includes: ['max98357a.h']
  },
  'max98357a_wait_until_done': {
    title: 'blockInfo.max98357a.title',
    message: 'blockInfo.max98357a.waitUntilDoneMessage',
    includes: ['max98357a.h']
  },
  'brightness_read': {
    title: 'blockInfo.brightness.title',
    message: 'blockInfo.brightness.message',
    includes: ['brightness.h']
  },
  'ws2812_init': {
    title: 'blockInfo.ws2812.title',
    message: 'blockInfo.ws2812.message',
    includes: ['ws2812.h']
  },
  'ws2812_set_pixel': {
    title: 'blockInfo.ws2812.title',
    message: 'blockInfo.ws2812.message',
    includes: ['ws2812.h']
  },
  'ws2812_fill': {
    title: 'blockInfo.ws2812.title',
    message: 'blockInfo.ws2812.message',
    includes: ['ws2812.h']
  },
  'ws2812_show': {
    title: 'blockInfo.ws2812.title',
    message: 'blockInfo.ws2812.message',
    includes: ['ws2812.h']
  },
  'ws2812_off': {
    title: 'blockInfo.ws2812.title',
    message: 'blockInfo.ws2812.message',
    includes: ['ws2812.h']
  },
  'ws2812_test': {
    title: 'blockInfo.ws2812.title',
    message: 'blockInfo.ws2812.message',
    testMessage: 'blockInfo.ws2812.testMessage',
    includes: ['ws2812.h']
  },
  'ble_remote_init': {
    title: 'blockInfo.bleRemote.title',
    message: 'blockInfo.bleRemote.message',
    includes: ['ble_remote.h']
  },
  'ble_remote_on_direction': {
    title: 'blockInfo.bleRemote.title',
    message: 'blockInfo.bleRemote.callbackMessage',
    includes: ['ble_remote.h']
  },
  'ble_remote_on_speed': {
    title: 'blockInfo.bleRemote.title',
    message: 'blockInfo.bleRemote.callbackMessage',
    includes: ['ble_remote.h']
  },
  'ble_remote_on_command': {
    title: 'blockInfo.bleRemote.title',
    message: 'blockInfo.bleRemote.callbackMessage',
    includes: ['ble_remote.h']
  },
  'ble_remote_direction_value': {
    title: 'blockInfo.bleRemote.title',
    message: 'blockInfo.bleRemote.directionValueMessage',
    includes: ['ble_remote.h']
  },
  'ble_remote_speed_value': {
    title: 'blockInfo.bleRemote.title',
    message: 'blockInfo.bleRemote.speedValueMessage',
    includes: ['ble_remote.h']
  },
  'ble_remote_command_value': {
    title: 'blockInfo.bleRemote.title',
    message: 'blockInfo.bleRemote.commandValueMessage',
    includes: ['ble_remote.h']
  },
  'ble_remote_send': {
    title: 'blockInfo.bleRemote.title',
    message: 'blockInfo.bleRemote.sendMessage',
    includes: ['ble_remote.h']
  },
  'ble_remote_is_connected': {
    title: 'blockInfo.bleRemote.title',
    message: 'blockInfo.bleRemote.message',
    includes: ['ble_remote.h']
  },
  'ble_remote_test': {
    title: 'blockInfo.bleRemote.title',
    message: 'blockInfo.bleRemote.testMessage',
    testMessage: 'blockInfo.bleRemote.testInfo',
    includes: ['ble_remote.h']
  },
  'test_all': {
    title: 'blockInfo.testAll.title',
    message: 'blockInfo.testAll.message',
    testMessage: 'blockInfo.testAll.testMessage',
    includes: ['test_all.h', 'oled.h', 'buttons.h', 'LEDMatrix.h', 'relais.h', 'dcmotor.h', 'dht11.h', 'ultrasonic.h', 'sdcard.h', 'max98357a.h', 'internalLED.h', 'servos.h']
  },
  'ky023_init': {
    title: 'blockInfo.ky023.title',
    message: 'blockInfo.ky023.initMessage',
    includes: ['ky023.h']
  },
  // ESP32-Controller uses the same block type names but with different implementation
  // Block info is looked up via getBlockInfo() which checks the board type
  'ky023_read_x': {
    title: 'blockInfo.ky023.title',
    message: 'blockInfo.ky023.message',
    includes: ['ky023.h']
  },
  'ky023_read_y': {
    title: 'blockInfo.ky023.title',
    message: 'blockInfo.ky023.message',
    includes: ['ky023.h']
  },
  'ky023_read_button': {
    title: 'blockInfo.ky023.title',
    message: 'blockInfo.ky023.message',
    includes: ['ky023.h']
  },
  'ky023_test': {
    title: 'blockInfo.ky023.title',
    message: 'blockInfo.ky023.message',
    testMessage: 'blockInfo.ky023.testMessage',
    includes: ['ky023.h']
  },
  // ESP32-Controller specific - same block type name but different includes (needs oled.h)
  'ky023_test_esp32_controller': {
    title: 'blockInfo.ky023.title',
    message: 'blockInfo.ky023.message',
    testMessage: 'blockInfo.ky023.testMessageEsp32Controller',
    includes: ['ky023.h', 'oled.h']
  },
  'serial_init': {
    title: 'blockInfo.serial.title',
    message: 'blockInfo.serial.message',
    includes: ['serial.h']
  },
  'serial_print': {
    title: 'blockInfo.serial.title',
    message: 'blockInfo.serial.message',
    includes: ['serial.h']
  },
  'serial_println': {
    title: 'blockInfo.serial.title',
    message: 'blockInfo.serial.message',
    includes: ['serial.h']
  },
  'serial_read_char': {
    title: 'blockInfo.serial.title',
    message: 'blockInfo.serial.message',
    includes: ['serial.h']
  },
  'serial_read_line': {
    title: 'blockInfo.serial.title',
    message: 'blockInfo.serial.message',
    includes: ['serial.h']
  },
  'serial_available': {
    title: 'blockInfo.serial.title',
    message: 'blockInfo.serial.message',
    includes: ['serial.h']
  },
  'haptic_init': {
    title: 'blockInfo.haptic.title',
    message: 'blockInfo.haptic.initMessage',
    includes: ['haptic.h']
  },
  'haptic_turn_on': {
    title: 'blockInfo.haptic.title',
    message: 'blockInfo.haptic.onMessage',
    includes: ['haptic.h']
  },
  'haptic_turn_off': {
    title: 'blockInfo.haptic.title',
    message: 'blockInfo.haptic.offMessage',
    includes: ['haptic.h']
  },
  'haptic_vibrate': {
    title: 'blockInfo.haptic.title',
    message: 'blockInfo.haptic.vibrateMessage',
    includes: ['haptic.h']
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
  'internal_led_test': {
    requires: 'internal_led_init',
    message: 'dependencies.ledTest'
  },
  'esp32_controller_led_set': {
    requires: 'esp32_controller_led_init',
    message: 'dependencies.ledSet'
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
  },
  'sdcard_write': {
    requires: 'sdcard_init',
    message: 'dependencies.sdcardWrite'
  },
  'sdcard_read': {
    requires: 'sdcard_init',
    message: 'dependencies.sdcardRead'
  },
  'sdcard_append': {
    requires: 'sdcard_init',
    message: 'dependencies.sdcardAppend'
  },
  'sdcard_exists': {
    requires: 'sdcard_init',
    message: 'dependencies.sdcardExists'
  },
  'sdcard_delete': {
    requires: 'sdcard_init',
    message: 'dependencies.sdcardDelete'
  },
  'sdcard_test': {
    requires: 'sdcard_init',
    message: 'dependencies.sdcardTest'
  },
  'max98357a_play_tone': {
    requires: 'max98357a_init',
    message: 'dependencies.max98357aPlayTone'
  },
  'max98357a_stop': {
    requires: 'max98357a_init',
    message: 'dependencies.max98357aStop'
  },
  'max98357a_test': {
    requires: 'max98357a_init',
    message: 'dependencies.max98357aTest'
  },
  'max98357a_play_file': {
    requires: 'max98357a_init',
    message: 'dependencies.max98357aPlayFile'
  },
  'max98357a_is_playing': {
    requires: 'max98357a_init',
    message: 'dependencies.max98357aIsPlaying'
  },
  'max98357a_wait_until_done': {
    requires: 'max98357a_init',
    message: 'dependencies.max98357aWaitUntilDone'
  },
  'ws2812_set_pixel': {
    requires: 'ws2812_init',
    message: 'dependencies.ws2812SetPixel'
  },
  'ws2812_fill': {
    requires: 'ws2812_init',
    message: 'dependencies.ws2812Fill'
  },
  'ws2812_show': {
    requires: 'ws2812_init',
    message: 'dependencies.ws2812Show'
  },
  'ws2812_off': {
    requires: 'ws2812_init',
    message: 'dependencies.ws2812Off'
  },
  'ws2812_test': {
    requires: 'ws2812_init',
    message: 'dependencies.ws2812Test'
  },
  'ble_remote_on_direction': {
    requires: 'ble_remote_init',
    message: 'dependencies.bleRemoteOnDirection'
  },
  'ble_remote_on_speed': {
    requires: 'ble_remote_init',
    message: 'dependencies.bleRemoteOnSpeed'
  },
  'ble_remote_on_command': {
    requires: 'ble_remote_init',
    message: 'dependencies.bleRemoteOnCommand'
  },
  'ble_remote_direction_value': {
    requires: 'ble_remote_on_direction',
    message: 'dependencies.bleRemoteDirectionValue'
  },
  'ble_remote_speed_value': {
    requires: 'ble_remote_on_speed',
    message: 'dependencies.bleRemoteSpeedValue'
  },
  'ble_remote_command_value': {
    requires: 'ble_remote_on_command',
    message: 'dependencies.bleRemoteCommandValue'
  },
  'ble_remote_send': {
    requires: 'ble_remote_init',
    message: 'dependencies.bleRemoteSend'
  },
  'ble_remote_is_connected': {
    requires: 'ble_remote_init',
    message: 'dependencies.bleRemoteIsConnected'
  },
  'ble_remote_test': {
    requires: 'ble_remote_init',
    message: 'dependencies.bleRemoteTest'
  },
  'ky023_read_x': {
    requires: 'ky023_init',
    message: 'dependencies.ky023ReadX'
  },
  'ky023_read_y': {
    requires: 'ky023_init',
    message: 'dependencies.ky023ReadY'
  },
  'ky023_read_button': {
    requires: 'ky023_init',
    message: 'dependencies.ky023ReadButton'
  },
  'ky023_test': {
    requires: 'ky023_init',
    message: 'dependencies.ky023Test'
  },
  'serial_print': {
    requires: 'serial_init',
    message: 'dependencies.serialPrint'
  },
  'serial_println': {
    requires: 'serial_init',
    message: 'dependencies.serialPrintln'
  },
  'serial_read_char': {
    requires: 'serial_init',
    message: 'dependencies.serialReadChar'
  },
  'serial_read_line': {
    requires: 'serial_init',
    message: 'dependencies.serialReadLine'
  },
  'serial_available': {
    requires: 'serial_init',
    message: 'dependencies.serialAvailable'
  },
  'haptic_turn_on': {
    requires: 'haptic_init',
    message: 'dependencies.hapticTurnOn'
  },
  'haptic_turn_off': {
    requires: 'haptic_init',
    message: 'dependencies.hapticTurnOff'
  },
  'haptic_vibrate': {
    requires: 'haptic_init',
    message: 'dependencies.hapticVibrate'
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

var seenPinWarnings = {
  _data: null,
  _init: function() {
    if (this._data === null) {
      try {
        this._data = JSON.parse(sessionStorage.getItem('seenPinWarnings') || '[]');
      } catch (e) {
        this._data = [];
      }
    }
  },
  has: function(key) {
    this._init();
    return this._data.indexOf(key) !== -1;
  },
  add: function(key) {
    this._init();
    if (this._data.indexOf(key) === -1) {
      this._data.push(key);
      try {
        sessionStorage.setItem('seenPinWarnings', JSON.stringify(this._data));
      } catch (e) {}
    }
  }
};

function getBlockInfo(blockType) {
  // Check if we're on BrumBrum board
  var isBrumbrum = false;
  var isESP32Controller = false;
  
  if (typeof selectedBoard === 'string') {
    isBrumbrum = selectedBoard === 'playground-brumbrum-esp32-s3-devkitc1';
    isESP32Controller = selectedBoard === 'esp32-controller';
  } else if (typeof localStorage !== 'undefined') {
    try {
      var board = localStorage.getItem('blocklyduino_board');
      isBrumbrum = board === 'playground-brumbrum-esp32-s3-devkitc1';
      isESP32Controller = board === 'esp32-controller';
    } catch (e) {}
  }
  
  // If on BrumBrum, try to get board-specific info first
  if (isBrumbrum) {
    var brumbrumKey = blockType + '_brumbrum';
    if (BLOCK_INFO.hasOwnProperty(brumbrumKey)) {
      return BLOCK_INFO[brumbrumKey];
    }
  }
  
  // If on ESP32-Controller, try to get board-specific info first
  if (isESP32Controller) {
    var esp32Key = blockType + '_esp32_controller';
    if (BLOCK_INFO.hasOwnProperty(esp32Key)) {
      return BLOCK_INFO[esp32Key];
    }
  }
  
  return BLOCK_INFO[blockType] || null;
}

function hasBlockInfo(blockType) {
  // Check if we're on BrumBrum board
  var isBrumbrum = false;
  var isESP32Controller = false;
  
  if (typeof selectedBoard === 'string') {
    isBrumbrum = selectedBoard === 'playground-brumbrum-esp32-s3-devkitc1';
    isESP32Controller = selectedBoard === 'esp32-controller';
  } else if (typeof localStorage !== 'undefined') {
    try {
      var board = localStorage.getItem('blocklyduino_board');
      isBrumbrum = board === 'playground-brumbrum-esp32-s3-devkitc1';
      isESP32Controller = board === 'esp32-controller';
    } catch (e) {}
  }
  
  // If on BrumBrum, check for board-specific info first
  if (isBrumbrum) {
    var brumbrumKey = blockType + '_brumbrum';
    if (BLOCK_INFO.hasOwnProperty(brumbrumKey)) {
      return true;
    }
  }
  
  // If on ESP32-Controller, check for board-specific info first
  if (isESP32Controller) {
    var esp32Key = blockType + '_esp32_controller';
    if (BLOCK_INFO.hasOwnProperty(esp32Key)) {
      return true;
    }
  }
  
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

var PIN_WARNINGS = {
  'esp32-controller': {
    '9': {
      title: 'blockInfo.pinWarning.gpio9.title',
      message: 'blockInfo.pinWarning.gpio9.message'
    },
    '20': {
      title: 'blockInfo.pinWarning.haptic.title',
      message: 'blockInfo.pinWarning.haptic.message'
    },
    '21': {
      title: 'blockInfo.pinWarning.serialTx.title',
      message: 'blockInfo.pinWarning.serialTx.message'
    }
  }
};

function getPinWarning(boardId, pin) {
  if (PIN_WARNINGS && PIN_WARNINGS[boardId] && PIN_WARNINGS[boardId][pin]) {
    return PIN_WARNINGS[boardId][pin];
  }
  return null;
}
