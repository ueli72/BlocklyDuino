/**
 * Pin Data for Arduino Uno (arduino-uno)
 * 
 * This file contains pin definitions and capabilities for the Arduino Uno board.
 * It is used by common blocks to populate pin dropdowns and generate pin reference information.
 */

var BOARD_ID = 'arduino-uno';
var BOARD_NAME = 'Arduino Uno';

var PIN_DATA = {
  "board": BOARD_ID,
  "name": BOARD_NAME,
  "pins": {
    "0": {"name": "D0", "capabilities": ["digital", "interrupt"], "special": ["Serial RX"], "reserved": true, "notes": "Hardware Serial RX - avoid using"},
    "1": {"name": "D1", "capabilities": ["digital", "pwm", "interrupt"], "special": ["Serial TX"], "reserved": true, "notes": "Hardware Serial TX - avoid using"},
    "2": {"name": "D2", "capabilities": ["digital", "interrupt"], "special": ["External Interrupt 0"], "reserved": false, "notes": "Best for external interrupts"},
    "3": {"name": "D3", "capabilities": ["digital", "pwm", "interrupt"], "special": ["External Interrupt 1", "PWM"], "reserved": false, "notes": "PWM + Interrupt capable"},
    "4": {"name": "D4", "capabilities": ["digital"], "special": [], "reserved": false, "notes": null},
    "5": {"name": "D5", "capabilities": ["digital", "pwm"], "special": ["PWM"], "reserved": false, "notes": "PWM - affects delay() timing"},
    "6": {"name": "D6", "capabilities": ["digital", "pwm"], "special": ["PWM"], "reserved": false, "notes": "PWM - affects delay() timing"},
    "7": {"name": "D7", "capabilities": ["digital"], "special": [], "reserved": false, "notes": null},
    "8": {"name": "D8", "capabilities": ["digital"], "special": [], "reserved": false, "notes": null},
    "9": {"name": "D9", "capabilities": ["digital", "pwm"], "special": ["PWM"], "reserved": false, "notes": "PWM capable"},
    "10": {"name": "D10", "capabilities": ["digital", "pwm"], "special": ["SPI SS", "PWM"], "reserved": false, "notes": "SPI Chip Select"},
    "11": {"name": "D11", "capabilities": ["digital", "pwm"], "special": ["SPI MOSI", "PWM"], "reserved": false, "notes": "SPI MOSI"},
    "12": {"name": "D12", "capabilities": ["digital"], "special": ["SPI MISO"], "reserved": false, "notes": "SPI MISO"},
    "13": {"name": "D13", "capabilities": ["digital"], "special": ["SPI SCK", "Built-in LED"], "reserved": false, "notes": "Built-in LED + SPI Clock"},
    "A0": {"name": "A0", "capabilities": ["digital", "analog"], "special": ["Analog Input 0"], "reserved": false, "notes": "ADC0"},
    "A1": {"name": "A1", "capabilities": ["digital", "analog"], "special": ["Analog Input 1"], "reserved": false, "notes": "ADC1"},
    "A2": {"name": "A2", "capabilities": ["digital", "analog"], "special": ["Analog Input 2"], "reserved": false, "notes": "ADC2"},
    "A3": {"name": "A3", "capabilities": ["digital", "analog"], "special": ["Analog Input 3"], "reserved": false, "notes": "ADC3"},
    "A4": {"name": "A4", "capabilities": ["digital", "analog"], "special": ["I2C SDA", "Analog Input 4"], "reserved": false, "notes": "I2C Data"},
    "A5": {"name": "A5", "capabilities": ["digital", "analog"], "special": ["I2C SCL", "Analog Input 5"], "reserved": false, "notes": "I2C Clock"}
  },
  "legend": {
    "digital": "Digital I/O",
    "pwm": "PWM Output (~)",
    "analog": "Analog Read (ADC)",
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
    if (pin.capabilities && pin.capabilities.includes('analog')) {
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
  window.PIN_DATA_UNO = PIN_DATA;
  window.getUnoPinInfo = getPinInfo;
  window.getUnoPinTooltip = getPinTooltip;
  window.getUnoPinsWithCapability = getPinsWithCapability;
  window.getUnoAllPinOptions = getAllPinOptions;
  window.getUnoDigitalPinOptions = getDigitalPinOptions;
  window.getUnoPwmPinOptions = getPwmPinOptions;
  window.getUnoAnalogPinOptions = getAnalogPinOptions;
  window.getUnoInterruptPinOptions = getInterruptPinOptions;
}
