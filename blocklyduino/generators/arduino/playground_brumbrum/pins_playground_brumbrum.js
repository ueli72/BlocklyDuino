/**
 * Pin Data for Playground BrumBrum (playground_brumbrum)
 * 
 * This file contains pin definitions and capabilities for the BrumBrum board.
 * It is used by common blocks to populate pin dropdowns and generate pin reference information.
 */

var BOARD_ID = 'playground_brumbrum';
var BOARD_NAME = 'Playground BrumBrum';

var PIN_DATA = {
  "board": BOARD_ID,
  "name": BOARD_NAME,
  "pins": {
    "0": {"name": "GPIO0", "capabilities": ["digital", "pwm", "interrupt", "adc2"], "special": ["DC Motor 3 IN1"], "reserved": false, "notes": "Boot pin - hold LOW during boot for download mode"},
    "1": {"name": "GPIO1", "capabilities": ["digital", "pwm", "interrupt", "adc1"], "special": ["Button SW1"], "reserved": false, "notes": "Button1 on Playground BrumBrum"},
    "2": {"name": "GPIO2", "capabilities": ["digital", "pwm", "interrupt", "adc1"], "special": ["Button SW2"], "reserved": false, "notes": "Button2 on Playground BrumBrum"},
    "3": {"name": "GPIO3", "capabilities": ["digital", "pwm", "interrupt", "adc1"], "special": [], "reserved": false, "notes": null},
    "4": {"name": "GPIO4", "capabilities": ["digital", "pwm", "interrupt", "adc1"], "special": [], "reserved": false, "notes": null},
    "5": {"name": "GPIO5", "capabilities": ["digital", "pwm", "interrupt", "adc1"], "special": ["SPI CS (SD Card)"], "reserved": false, "notes": "SD Card Chip Select"},
    "6": {"name": "GPIO6", "capabilities": ["digital", "pwm", "interrupt", "adc1"], "special": [], "reserved": false, "notes": null},
    "7": {"name": "GPIO7", "capabilities": ["digital", "pwm", "interrupt", "adc1"], "special": ["DC Motor 3 IN2"], "reserved": false, "notes": null},
    "8": {"name": "GPIO8", "capabilities": ["digital", "pwm", "interrupt", "adc1"], "special": ["I2C SDA (OLED)"], "reserved": false, "notes": "I2C Data - OLED Display"},
    "9": {"name": "GPIO9", "capabilities": ["digital", "pwm", "interrupt", "adc1"], "special": ["I2C SCL (OLED)"], "reserved": false, "notes": "I2C Clock - OLED Display"},
    "11": {"name": "GPIO11", "capabilities": ["digital", "pwm", "interrupt", "adc2"], "special": [], "reserved": false, "notes": "ADC2 - not usable with WiFi"},
    "12": {"name": "GPIO12", "capabilities": ["digital", "pwm", "interrupt", "adc2"], "special": ["DC Motor 4 IN1"], "reserved": false, "notes": "ADC2 - not usable with WiFi"},
    "13": {"name": "GPIO13", "capabilities": ["digital", "pwm", "interrupt", "adc2"], "special": ["DC Motor 4 IN2"], "reserved": false, "notes": "ADC2 - not usable with WiFi"},
    "14": {"name": "GPIO14", "capabilities": ["digital", "pwm", "interrupt", "adc2"], "special": ["Ultrasonic Back TRIG"], "reserved": false, "notes": "ADC2 - not usable with WiFi"},
    "15": {"name": "GPIO15", "capabilities": ["digital", "pwm", "interrupt", "adc2"], "special": ["DC Motor 1 IN1"], "reserved": false, "notes": "ADC2 - not usable with WiFi"},
    "16": {"name": "GPIO16", "capabilities": ["digital", "pwm", "interrupt", "adc2"], "special": ["DC Motor 1 IN2"], "reserved": false, "notes": "ADC2 - not usable with WiFi"},
    "17": {"name": "GPIO17", "capabilities": ["digital", "pwm", "interrupt", "adc2"], "special": ["Ultrasonic Front TRIG"], "reserved": false, "notes": "ADC2 - not usable with WiFi"},
    "18": {"name": "GPIO18", "capabilities": ["digital", "pwm", "interrupt", "adc2"], "special": ["SPI CLK (SD Card)"], "reserved": false, "notes": "SD Card SPI Clock"},
    "19": {"name": "GPIO19", "capabilities": ["digital", "pwm", "interrupt", "adc2"], "special": ["SPI MISO (SD Card)"], "reserved": false, "notes": "SD Card SPI MISO"},
    "20": {"name": "GPIO20", "capabilities": ["digital", "pwm", "interrupt", "adc2"], "special": ["SPI MOSI (SD Card)"], "reserved": false, "notes": "SD Card SPI MOSI"},
    "21": {"name": "GPIO21", "capabilities": ["digital", "pwm", "interrupt", "adc2"], "special": ["Ultrasonic Back ECHO"], "reserved": false, "notes": "ADC2 - not usable with WiFi"},
    "35": {"name": "GPIO35", "capabilities": ["digital", "pwm", "interrupt"], "special": ["Ultrasonic Front ECHO"], "reserved": false, "notes": null},
    "37": {"name": "GPIO37", "capabilities": ["digital", "pwm", "interrupt"], "special": ["Servo 1"], "reserved": false, "notes": "SG90 Servo signal pin"},
    "38": {"name": "GPIO38", "capabilities": ["digital", "pwm", "interrupt"], "special": ["Servo 2"], "reserved": false, "notes": "SG90 Servo signal pin"},
    "39": {"name": "GPIO39", "capabilities": ["digital", "pwm", "interrupt"], "special": ["MAX98357A SD_MODE"], "reserved": false, "notes": "Audio amplifier shutdown mode"},
    "40": {"name": "GPIO40", "capabilities": ["digital", "pwm", "interrupt"], "special": ["I2S DIN (Audio)"], "reserved": false, "notes": "MAX98357A audio data"},
    "41": {"name": "GPIO41", "capabilities": ["digital", "pwm", "interrupt"], "special": ["I2S BCLK (Audio)"], "reserved": false, "notes": "MAX98357A bit clock"},
    "42": {"name": "GPIO42", "capabilities": ["digital", "pwm", "interrupt"], "special": ["I2S LRC (Audio)"], "reserved": false, "notes": "MAX98357A left/right clock"},
    "43": {"name": "GPIO43", "capabilities": ["digital", "pwm", "interrupt"], "special": ["DC Motor 2 IN1", "UART0 TX"], "reserved": false, "notes": "USB Serial TX - also DC Motor"},
    "44": {"name": "GPIO44", "capabilities": ["digital", "pwm", "interrupt"], "special": ["DC Motor 2 IN2", "UART0 RX"], "reserved": false, "notes": "USB Serial RX - also DC Motor"},
    "45": {"name": "GPIO45", "capabilities": ["digital", "pwm", "interrupt"], "special": ["Servo 3"], "reserved": false, "notes": "SG90 Servo signal pin"}
  },
  "legend": {
    "digital": "Digital I/O",
    "pwm": "PWM Output (LEDC)",
    "adc1": "Analog Read (ADC1)",
    "adc2": "Analog Read (ADC2 - not with WiFi)",
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
    if (pin.capabilities && (pin.capabilities.includes('adc1') || pin.capabilities.includes('adc2'))) {
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
  window.PIN_DATA_PLAYGROUND_BRUMBRUM = PIN_DATA;
  window.getPlaygroundBrumbrumPinInfo = getPinInfo;
  window.getPlaygroundBrumbrumPinTooltip = getPinTooltip;
  window.getPlaygroundBrumbrumPinsWithCapability = getPinsWithCapability;
  window.getPlaygroundBrumbrumAllPinOptions = getAllPinOptions;
  window.getPlaygroundBrumbrumDigitalPinOptions = getDigitalPinOptions;
  window.getPlaygroundBrumbrumPwmPinOptions = getPwmPinOptions;
  window.getPlaygroundBrumbrumAnalogPinOptions = getAnalogPinOptions;
  window.getPlaygroundBrumbrumInterruptPinOptions = getInterruptPinOptions;
}
