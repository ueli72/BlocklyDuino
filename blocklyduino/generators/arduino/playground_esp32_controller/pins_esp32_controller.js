/**
 * Pin Data for ESP32-C3 0.42 OLED (ABRobot ESP32-C3 0.42 OLED)
 * 
 * This file contains pin definitions and capabilities for the ESP32-C3 0.42 OLED board.
 * It is used by common blocks to populate pin dropdowns and generate pin reference information.
 * 
 * Board features:
 * - ESP32-C3FN4 with 4MB Flash
 * - 0.42" OLED display (72x40 pixels, I2C on GPIO5/6)
 * - Built-in LED on GPIO8 (active LOW)
 * - BOOT button on GPIO9
 * - Native USB-C
 * - WiFi and Bluetooth 5.0
 */

var BOARD_ID = 'esp32-controller';
var BOARD_NAME = 'ESP32-C3 0.42 OLED';

var PIN_DATA = {
  "board": BOARD_ID,
  "name": BOARD_NAME,
  "pins": {
    "0": {"name": "GPIO0", "capabilities": ["digital", "pwm", "interrupt", "adc"], "special": ["Joystick Left Button"], "reserved": false, "notes": "Boot pin - hold LOW during boot for download mode"},
    "1": {"name": "GPIO1", "capabilities": ["digital", "pwm", "interrupt", "adc"], "special": ["Joystick Left X"], "reserved": false, "notes": "Analog input for left joystick X-axis"},
    "2": {"name": "GPIO2", "capabilities": ["digital", "pwm", "interrupt", "adc"], "special": ["Joystick Left Y"], "reserved": false, "notes": "Analog input for left joystick Y-axis"},
    "3": {"name": "GPIO3", "capabilities": ["digital", "pwm", "interrupt", "adc"], "special": ["Joystick Right Button"], "reserved": false, "notes": "Right joystick button"},
    "4": {"name": "GPIO4", "capabilities": ["digital", "pwm", "interrupt", "adc"], "special": ["Joystick Right X"], "reserved": false, "notes": "Analog input for right joystick X-axis"},
    "5": {"name": "GPIO5", "capabilities": ["digital", "pwm", "interrupt", "adc"], "special": ["I2C SDA (OLED)"], "reserved": true, "notes": "I2C Data to onboard OLED - shared with display"},
    "6": {"name": "GPIO6", "capabilities": ["digital", "pwm", "interrupt", "adc"], "special": ["I2C SCL (OLED)"], "reserved": true, "notes": "I2C Clock to onboard OLED - shared with display"},
    "7": {"name": "GPIO7", "capabilities": ["digital", "pwm", "interrupt"], "special": ["Extra Button 2"], "reserved": false, "notes": null},
    "8": {"name": "GPIO8", "capabilities": ["digital", "pwm", "interrupt"], "special": ["Built-in LED", "Extra Button 3"], "reserved": false, "notes": "Onboard LED (active LOW - set LOW to turn on)"},
    "9": {"name": "GPIO9", "capabilities": ["digital", "interrupt"], "special": ["BOOT Button", "Extra Button 4"], "reserved": false, "notes": "WARNING: BOOT Button and Extra Button 4 share this pin - only one can be used at a time"},
    "10": {"name": "GPIO10", "capabilities": ["digital", "pwm", "interrupt"], "special": ["Joystick Right Y"], "reserved": false, "notes": null},
    "20": {"name": "GPIO20", "capabilities": ["digital", "pwm", "interrupt"], "special": ["Haptic Motor", "UART RX"], "reserved": false, "notes": "WARNING: Haptic motor uses this pin - Serial RX unavailable when haptic is initialized"},
    "21": {"name": "GPIO21", "capabilities": ["digital", "pwm", "interrupt"], "special": ["Extra Button 1", "UART TX"], "reserved": false, "notes": "WARNING: Extra Button 1 uses this pin - Serial TX unavailable when button is used"}
  },
  "oled": {
    "width": 72,
    "height": 40,
    "bufferWidth": 128,
    "bufferHeight": 64,
    "xOffset": 28,
    "yOffset": 24,
    "i2cAddress": "0x3C",
    "sdaPin": 5,
    "sclPin": 6
  },
  "led": {
    "pin": 8,
    "activeLow": true
  },
  "button": {
    "bootPin": 9,
    "activeLow": true
  },
  "legend": {
    "digital": "Digital I/O",
    "pwm": "PWM Output",
    "adc": "Analog Read (ADC)",
    "interrupt": "External Interrupt"
  }
};

// Function to get pin info for this board
function getPinInfo(pin) {
  if (!PIN_DATA || !PIN_DATA.pins[pin]) return null;
  return PIN_DATA.pins[pin];
}

// Function to get pin tooltip
function getPinTooltip(pin) {
  var pinInfo = getPinInfo(pin);
  if (!pinInfo) return '';
  
  var tooltip = pinInfo.name;
  if (pinInfo.capabilities && pinInfo.capabilities.length > 0) {
    tooltip += '\n' + pinInfo.capabilities.join(', ').toUpperCase();
  }
  if (pinInfo.special && pinInfo.special.length > 0) {
    tooltip += '\nSpecial: ' + pinInfo.special.join(', ');
  }
  if (pinInfo.notes) {
    tooltip += '\n' + pinInfo.notes;
  }
  if (pinInfo.reserved) {
    tooltip += '\n⚠️ RESERVED - avoid using';
  }
  return tooltip;
}

// Function to get all pins with a specific capability
function getPinsWithCapability(capability) {
  var pins = [];
  Object.keys(PIN_DATA.pins).forEach(function(pinKey) {
    var pin = PIN_DATA.pins[pinKey];
    if (pin.capabilities && pin.capabilities.includes(capability)) {
      pins.push({
        pin: pinKey,
        name: pin.name,
        info: pin
      });
    }
  });
  return pins;
}

// Function to get dropdown options for all available pins
function getAllPinOptions() {
  var options = [];
  Object.keys(PIN_DATA.pins).forEach(function(pinKey) {
    var pin = PIN_DATA.pins[pinKey];
    options.push([pin.name + (pin.special.length > 0 ? ' - ' + pin.special.join(', ') : ''), pinKey]);
  });
  return options;
}

// Function to get dropdown options for digital pins only
function getDigitalPinOptions() {
  var options = [];
  Object.keys(PIN_DATA.pins).forEach(function(pinKey) {
    var pin = PIN_DATA.pins[pinKey];
    if (pin.capabilities && pin.capabilities.includes('digital')) {
      options.push([pin.name + (pin.special.length > 0 ? ' - ' + pin.special.join(', ') : ''), pinKey]);
    }
  });
  return options;
}

// Function to get dropdown options for PWM pins only
function getPwmPinOptions() {
  var options = [];
  Object.keys(PIN_DATA.pins).forEach(function(pinKey) {
    var pin = PIN_DATA.pins[pinKey];
    if (pin.capabilities && pin.capabilities.includes('pwm')) {
      options.push([pin.name + (pin.special.length > 0 ? ' - ' + pin.special.join(', ') : ''), pinKey]);
    }
  });
  return options;
}

// Function to get dropdown options for analog pins only
function getAnalogPinOptions() {
  var options = [];
  Object.keys(PIN_DATA.pins).forEach(function(pinKey) {
    var pin = PIN_DATA.pins[pinKey];
    if (pin.capabilities && pin.capabilities.includes('adc')) {
      options.push([pin.name + (pin.special.length > 0 ? ' - ' + pin.special.join(', ') : ''), pinKey]);
    }
  });
  return options;
}

// Function to get dropdown options for interrupt pins only
function getInterruptPinOptions() {
  var options = [];
  Object.keys(PIN_DATA.pins).forEach(function(pinKey) {
    var pin = PIN_DATA.pins[pinKey];
    if (pin.capabilities && pin.capabilities.includes('interrupt')) {
      options.push([pin.name + (pin.special.length > 0 ? ' - ' + pin.special.join(', ') : ''), pinKey]);
    }
  });
  return options;
}

// Export for use by common blocks
if (typeof window !== 'undefined') {
  window.PIN_DATA_ESP32_CONTROLLER = PIN_DATA;
  window.getESP32ControllerPinInfo = getPinInfo;
  window.getESP32ControllerPinTooltip = getPinTooltip;
  window.getESP32ControllerPinsWithCapability = getPinsWithCapability;
  window.getESP32ControllerAllPinOptions = getAllPinOptions;
  window.getESP32ControllerDigitalPinOptions = getDigitalPinOptions;
  window.getESP32ControllerPwmPinOptions = getPwmPinOptions;
  window.getESP32ControllerAnalogPinOptions = getAnalogPinOptions;
  window.getESP32ControllerInterruptPinOptions = getInterruptPinOptions;
}
