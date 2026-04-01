/**
 * Execute the user's code.
 * Just a quick and dirty eval.  No checks for infinite loops, etc.
 */
function runJS() {
  var code = Blockly.Generator.workspaceToCode('JavaScript');
  try {
    eval(code);
  } catch (e) {
    showAlertModal(i18n.t('messages.programError', { error: e }));
  }
}

var sessionWarnings = [];

var selectedBoard = null;

function getActiveBoardId() {
  if (selectedBoard) {
    return selectedBoard;
  }
  if (typeof getSelectedBoard === 'function') {
    var storedBoard = getSelectedBoard();
    if (storedBoard) {
      return storedBoard;
    }
  }
  if (typeof document !== 'undefined') {
    var boardSelector = document.getElementById('boardSelector');
    if (boardSelector && boardSelector.value) {
      return boardSelector.value;
    }
  }
  return null;
}

function annotateXmlWithBoard(xmlDom) {
  if (!xmlDom || typeof xmlDom.setAttribute !== 'function') {
    return xmlDom;
  }
  var boardId = getActiveBoardId();
  if (boardId) {
    xmlDom.setAttribute('board', boardId);
  }
  return xmlDom;
}

function applyBoardSelectionFromXml(xmlDom) {
  if (!xmlDom || typeof xmlDom.getAttribute !== 'function') {
    return;
  }
  var boardId = xmlDom.getAttribute('board');
  if (!boardId || boardId === getActiveBoardId() || !BOARD_TEMPLATES[boardId]) {
    return;
  }
  selectBoard(boardId);
}

var GENERATOR_SETS = {};
var CURRENT_GENERATOR_SET = null;
var GENERATOR_SET_TARGET = null;
var loadedExternalScripts = {};
var BRUMBRUM_GENERATOR_SCRIPTS = [
  'generators/arduino/playground_brumbrum/sg90.js',
  'generators/arduino/playground_brumbrum/internal_led.js',
  'generators/arduino/playground_brumbrum/button.js',
  'generators/arduino/playground_brumbrum/ledmatrix.js',
  'generators/arduino/playground_brumbrum/oled.js',
  'generators/arduino/playground_brumbrum/relais.js',
  'generators/arduino/playground_brumbrum/dc_motor.js',
  'generators/arduino/playground_brumbrum/ultrasonic.js',
  'generators/arduino/playground_brumbrum/sdcard.js',
  'generators/arduino/playground_brumbrum/max98357a.js',
  'generators/arduino/playground_brumbrum/brightness.js',
  'generators/arduino/playground_brumbrum/ws2812.js',
  'generators/arduino/playground_brumbrum/ble_remote.js',
  'generators/arduino/playground_brumbrum/test_all.js',
  'generators/arduino/playground_brumbrum/timer.js',
  'generators/arduino/playground_brumbrum/ky023.js',
  'generators/arduino/playground_brumbrum/serial.js',
  'generators/arduino/playground_brumbrum/variable.js',
  'generators/arduino/playground_brumbrum/global_array.js',
  'generators/arduino/playground_brumbrum/custom_code.js'
];
var brumbrumGeneratorsLoading = null;

var BOARD_INFO = {
  'esp32-s3-devkitc1': {
    name: 'BWS Playground Master',
    image: 'media/playground.png'
  },
  'playground-brumbrum-esp32-s3-devkitc1': {
    name: 'Playground BrumBrum (esp32-s3-devkitc1)',
    image: 'media/brumbrum.png'
  },
  'arduino-uno': {
    name: 'Arduino Uno',
    image: 'media/uno.jpg'
  }
};

var PIN_DATA = {
  'esp32-s3-devkitc1': {
    "board": "esp32-s3-devkitc1",
    "name": "BWS Playground Master",
    "pins": {
      "0": {"name": "GPIO0", "capabilities": ["digital", "pwm", "interrupt", "adc2"], "special": ["DC Motor 3 IN1"], "reserved": false, "notes": "Boot pin - hold LOW during boot for download mode"},
      "1": {"name": "GPIO1", "capabilities": ["digital", "pwm", "interrupt", "adc1"], "special": ["Button SW1"], "reserved": false, "notes": "Button1 on Playground Master"},
      "2": {"name": "GPIO2", "capabilities": ["digital", "pwm", "interrupt", "adc1"], "special": ["Button SW4"], "reserved": false, "notes": "Button4 on Playground Master"},
      "3": {"name": "GPIO3", "capabilities": ["digital", "pwm", "interrupt", "adc1"], "special": ["Button SW3"], "reserved": false, "notes": "Button3 on Playground Master"},
      "4": {"name": "GPIO4", "capabilities": ["digital", "pwm", "interrupt", "adc1"], "special": ["Button SW2"], "reserved": false, "notes": "Button2 on Playground Master"},
      "5": {"name": "GPIO5", "capabilities": ["digital", "pwm", "interrupt", "adc1"], "special": ["SPI CS (SD Card)"], "reserved": false, "notes": "SD Card Chip Select"},
      "6": {"name": "GPIO6", "capabilities": ["digital", "pwm", "interrupt", "adc1"], "special": ["DHT11 Sensor"], "reserved": false, "notes": "Temperature/Humidity sensor"},
      "7": {"name": "GPIO7", "capabilities": ["digital", "pwm", "interrupt", "adc1"], "special": ["DC Motor 3 IN2"], "reserved": false, "notes": null},
      "8": {"name": "GPIO8", "capabilities": ["digital", "pwm", "interrupt", "adc1"], "special": ["I2C SDA (OLED)"], "reserved": false, "notes": "I2C Data - OLED Display"},
      "9": {"name": "GPIO9", "capabilities": ["digital", "pwm", "interrupt", "adc1"], "special": ["I2C SCL (OLED)"], "reserved": false, "notes": "I2C Clock - OLED Display"},
      "10": {"name": "GPIO10", "capabilities": ["digital", "pwm", "interrupt", "adc1"], "special": ["LED Matrix (16 LEDs)"], "reserved": false, "notes": "WS2812B LED Matrix data pin"},
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
      "45": {"name": "GPIO45", "capabilities": ["digital", "pwm", "interrupt"], "special": ["Servo 3"], "reserved": false, "notes": "SG90 Servo signal pin"},
      "47": {"name": "GPIO47", "capabilities": ["digital", "pwm", "interrupt"], "special": ["Relay 2"], "reserved": false, "notes": null},
      "48": {"name": "GPIO48", "capabilities": ["digital", "pwm", "interrupt"], "special": ["Internal RGB LED", "Relay 1"], "reserved": false, "notes": "WS2812B NeoPixel - also Relay 1"}
    },
    "legend": {
      "digital": "Digital I/O",
      "pwm": "PWM Output (LEDC)",
      "adc1": "Analog Read (ADC1)",
      "adc2": "Analog Read (ADC2 - not with WiFi)",
      "interrupt": "External Interrupt"
    }
  },
  'arduino-uno': {
    "board": "arduino-uno",
    "name": "Arduino Uno",
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
  }
};

var brumbrumPins = JSON.parse(JSON.stringify(PIN_DATA['esp32-s3-devkitc1']));
brumbrumPins.board = 'playground-brumbrum-esp32-s3-devkitc1';
brumbrumPins.name = 'Playground BrumBrum (esp32-s3-devkitc1)';
Object.keys(brumbrumPins.pins).forEach(function(pinKey) {
  var pinNotes = brumbrumPins.pins[pinKey].notes;
  if (typeof pinNotes === 'string') {
    brumbrumPins.pins[pinKey].notes = pinNotes.split('Playground Master').join('Playground BrumBrum');
  }
});
brumbrumPins.pins['1'].special = ['Button SW1'];
brumbrumPins.pins['1'].notes = 'Button1 on Playground BrumBrum';
brumbrumPins.pins['2'].special = ['Button SW2'];
brumbrumPins.pins['2'].notes = 'Button2 on Playground BrumBrum';
['3', '4'].forEach(function(pinKey) {
  brumbrumPins.pins[pinKey].special = [];
  brumbrumPins.pins[pinKey].notes = null;
});
// Remove DHT11 sensor pin for BrumBrum
brumbrumPins.pins['6'].special = [];
brumbrumPins.pins['6'].notes = null;
PIN_DATA['playground-brumbrum-esp32-s3-devkitc1'] = brumbrumPins;

function captureGeneratorSet(name) {
  if (typeof Blockly === 'undefined' || !Blockly.Arduino) return;
  var set = {};
  Object.keys(Blockly.Arduino).forEach(function(key) {
    var value = Blockly.Arduino[key];
    if (typeof value === 'function') {
      set[key] = value;
    }
  });
  GENERATOR_SETS[name] = set;
}

function applyGeneratorSet(name) {
  var set = GENERATOR_SETS[name];
  if (!set || typeof Blockly === 'undefined' || !Blockly.Arduino) return;
  Object.keys(set).forEach(function(key) {
    Blockly.Arduino[key] = set[key];
  });
  CURRENT_GENERATOR_SET = name;
}

function ensureMasterGeneratorSetCaptured() {
  if (!GENERATOR_SETS.master) {
    captureGeneratorSet('master');
    if (!CURRENT_GENERATOR_SET) {
      CURRENT_GENERATOR_SET = 'master';
    }
  }
}

function ensureBrumbrumGeneratorsLoaded() {
  ensureMasterGeneratorSetCaptured();
  if (GENERATOR_SETS.brumbrum) {
    return Promise.resolve();
  }
  if (brumbrumGeneratorsLoading) {
    return brumbrumGeneratorsLoading;
  }

  var previousSet = CURRENT_GENERATOR_SET || 'master';
  brumbrumGeneratorsLoading = loadScriptsSequential(BRUMBRUM_GENERATOR_SCRIPTS).then(function() {
    captureGeneratorSet('brumbrum');
    applyGeneratorSet(previousSet);
  }).catch(function(error) {
    console.error('Failed to load BrumBrum generator scripts', error);
  }).finally(function() {
    brumbrumGeneratorsLoading = null;
  });

  return brumbrumGeneratorsLoading;
}

function updateGeneratorsForBoard(boardId) {
  ensureMasterGeneratorSetCaptured();
  GENERATOR_SET_TARGET = boardId;
  if (boardId === 'playground-brumbrum-esp32-s3-devkitc1') {
    ensureBrumbrumGeneratorsLoaded().then(function() {
      if (GENERATOR_SET_TARGET === 'playground-brumbrum-esp32-s3-devkitc1') {
        applyGeneratorSet('brumbrum');
      }
    });
  } else {
    applyGeneratorSet('master');
  }
}

function loadScriptsSequential(paths) {
  return paths.reduce(function(prev, path) {
    return prev.then(function() {
      return loadScript(path);
    });
  }, Promise.resolve());
}

function loadScript(path) {
  if (loadedExternalScripts[path]) {
    return Promise.resolve();
  }
  return new Promise(function(resolve, reject) {
    var script = document.createElement('script');
    script.src = path;
    script.onload = function() {
      loadedExternalScripts[path] = true;
      resolve();
    };
    script.onerror = function() {
      reject(new Error('Unable to load script: ' + path));
    };
    document.head.appendChild(script);
  });
}

function getPinInfo(boardId, pin) {
  var boardData = PIN_DATA[boardId];
  if (!boardData || !boardData.pins[pin]) return null;
  return boardData.pins[pin];
}

function getPinTooltip(boardId, pin) {
  var pinInfo = getPinInfo(boardId, pin);
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

function togglePinReference() {
  var panel = document.getElementById('pinReferencePanel');
  if (!panel) {
    createPinReferencePanel();
    panel = document.getElementById('pinReferencePanel');
  }
  if (panel) {
    panel.classList.toggle('show');
  }
}

function createPinReferencePanel() {
  if (document.getElementById('pinReferencePanel')) return;
  
  var boardId = getSelectedBoard() || 'esp32-s3-devkitc1';
  var boardData = PIN_DATA[boardId];
  if (!boardData) return;
  
  var panel = document.createElement('div');
  panel.id = 'pinReferencePanel';
  panel.className = 'pin-reference-panel';
  
  var header = document.createElement('div');
  header.className = 'pin-reference-header';
  header.innerHTML = '<span>' + (typeof i18n !== 'undefined' ? i18n.t('pinReference.title') : 'Pin Reference') + '</span><button class="pin-reference-close" onclick="togglePinReference()">×</button>';
  panel.appendChild(header);
  
  var filterContainer = document.createElement('div');
  filterContainer.className = 'pin-reference-filter';
  filterContainer.innerHTML = '<input type="text" id="pinFilterInput" placeholder="' + (typeof i18n !== 'undefined' ? i18n.t('pinReference.filter') : 'Filter pins...') + '" oninput="filterPinReference()">';
  panel.appendChild(filterContainer);
  
  var capFilterContainer = document.createElement('div');
  capFilterContainer.className = 'pin-reference-cap-filters';
  capFilterContainer.id = 'pinCapFilters';
  var capabilities = ['digital', 'pwm', 'analog', 'interrupt', 'adc1', 'adc2'];
  capabilities.forEach(function(cap) {
    var badge = document.createElement('span');
    badge.className = 'pin-cap pin-cap-' + cap + ' pin-cap-filter';
    badge.textContent = cap;
    badge.onclick = function() { filterByCapability(cap); };
    badge.style.cursor = 'pointer';
    capFilterContainer.appendChild(badge);
  });
  var clearBtn = document.createElement('span');
  clearBtn.className = 'pin-cap-filter-clear';
  clearBtn.textContent = '✕';
  clearBtn.onclick = function() { clearCapabilityFilter(); };
  clearBtn.style.cursor = 'pointer';
  clearBtn.title = typeof i18n !== 'undefined' ? i18n.t('pinReference.clearFilter') : 'Clear filter';
  capFilterContainer.appendChild(clearBtn);
  panel.appendChild(capFilterContainer);
  
  var content = document.createElement('div');
  content.className = 'pin-reference-content';
  content.id = 'pinReferenceContent';
  
  var table = document.createElement('table');
  table.className = 'pin-reference-table';
  table.id = 'pinReferenceTable';
  
  var thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>' + (typeof i18n !== 'undefined' ? i18n.t('pinReference.pin') : 'Pin') + '</th><th>' + (typeof i18n !== 'undefined' ? i18n.t('pinReference.capabilities') : 'Capabilities') + '</th><th>' + (typeof i18n !== 'undefined' ? i18n.t('pinReference.special') : 'Special') + '</th><th>' + (typeof i18n !== 'undefined' ? i18n.t('pinReference.notes') : 'Notes') + '</th></tr>';
  table.appendChild(thead);
  
  var tbody = document.createElement('tbody');
  tbody.id = 'pinReferenceBody';
  var pins = boardData.pins;
  var pinKeys = Object.keys(pins).sort(function(a, b) {
    var aNum = parseInt(a.replace(/\D/g, '')) || 0;
    var bNum = parseInt(b.replace(/\D/g, '')) || 0;
    if (isNaN(aNum) && isNaN(bNum)) return a.localeCompare(b);
    if (isNaN(aNum)) return 1;
    if (isNaN(bNum)) return -1;
    return aNum - bNum;
  });
  
  pinKeys.forEach(function(pinKey) {
    var pin = pins[pinKey];
    var tr = document.createElement('tr');
    tr.className = 'pin-row';
    tr.dataset.pin = pin.name.toLowerCase();
    tr.dataset.capabilities = pin.capabilities.join(' ').toLowerCase();
    tr.dataset.special = (pin.special || []).join(' ').toLowerCase();
    tr.dataset.notes = (pin.notes || '').toLowerCase();
    if (pin.reserved) tr.classList.add('pin-reserved');
    
    var capHtml = pin.capabilities.map(function(cap) {
      return '<span class="pin-cap pin-cap-' + cap + '">' + cap + '</span>';
    }).join(' ');
    
    tr.innerHTML = '<td><strong>' + pin.name + '</strong></td><td>' + capHtml + '</td><td>' + (pin.special ? pin.special.join('<br>') : '') + '</td><td>' + (pin.notes || '') + '</td>';
    tbody.appendChild(tr);
  });
  
  table.appendChild(tbody);
  content.appendChild(table);
  panel.appendChild(content);
  
  document.body.appendChild(panel);
}

var currentCapabilityFilter = null;

function filterByCapability(cap) {
  currentCapabilityFilter = cap;
  document.getElementById('pinFilterInput').value = '';
  
  var badges = document.querySelectorAll('.pin-cap-filter');
  badges.forEach(function(badge) {
    badge.classList.remove('active');
    if (badge.textContent === cap) {
      badge.classList.add('active');
    }
  });
  
  var rows = document.querySelectorAll('#pinReferenceBody tr.pin-row');
  rows.forEach(function(row) {
    var capabilities = row.dataset.capabilities || '';
    row.style.display = capabilities.includes(cap) ? '' : 'none';
  });
}

function clearCapabilityFilter() {
  currentCapabilityFilter = null;
  document.getElementById('pinFilterInput').value = '';
  
  var badges = document.querySelectorAll('.pin-cap-filter');
  badges.forEach(function(badge) {
    badge.classList.remove('active');
  });
  
  var rows = document.querySelectorAll('#pinReferenceBody tr.pin-row');
  rows.forEach(function(row) {
    row.style.display = '';
  });
}

function filterPinReference() {
  var input = document.getElementById('pinFilterInput');
  var filter = input.value.toLowerCase();
  
  currentCapabilityFilter = null;
  var badges = document.querySelectorAll('.pin-cap-filter');
  badges.forEach(function(badge) {
    badge.classList.remove('active');
  });
  
  var rows = document.querySelectorAll('#pinReferenceBody tr.pin-row');
  
  rows.forEach(function(row) {
    var pin = row.dataset.pin || '';
    var capabilities = row.dataset.capabilities || '';
    var special = row.dataset.special || '';
    var notes = row.dataset.notes || '';
    
    var match = pin.includes(filter) || capabilities.includes(filter) || special.includes(filter) || notes.includes(filter);
    row.style.display = match ? '' : 'none';
  });
}

function filterPinReference() {
  var input = document.getElementById('pinFilterInput');
  var filter = input.value.toLowerCase();
  var rows = document.querySelectorAll('#pinReferenceBody tr.pin-row');
  
  rows.forEach(function(row) {
    var pin = row.dataset.pin || '';
    var capabilities = row.dataset.capabilities || '';
    var special = row.dataset.special || '';
    var notes = row.dataset.notes || '';
    
    var match = pin.includes(filter) || capabilities.includes(filter) || special.includes(filter) || notes.includes(filter);
    row.style.display = match ? '' : 'none';
  });
}

function updatePinReferencePanel() {
  var existingPanel = document.getElementById('pinReferencePanel');
  if (existingPanel) {
    existingPanel.remove();
  }
  createPinReferencePanel();
}

function updateBoardInfoDisplay(boardId) {
  var boardInfo = document.getElementById('boardInfo');
  var boardImage = document.getElementById('boardImage');
  var boardName = document.getElementById('boardName');
  
  if (!boardInfo || !boardImage || !boardName) return;
  
  var info = BOARD_INFO[boardId];
  if (info) {
    boardImage.src = info.image;
    boardName.textContent = info.name;
    boardInfo.style.display = 'flex';
  } else {
    boardInfo.style.display = 'none';
  }
}

function getSelectedBoard() {
  return localStorage.getItem('blocklyduino_board');
}

function setSelectedBoard(boardId) {
  localStorage.setItem('blocklyduino_board', boardId);
  selectedBoard = boardId;
}

function clearSelectedBoard() {
  localStorage.removeItem('blocklyduino_board');
  selectedBoard = null;
}

function showBoardSelectionModal() {
  // Update translations before showing modal
  if (typeof i18n !== 'undefined' && typeof i18n.updateUI === 'function') {
    i18n.updateUI();
  }
  var modalEl = document.getElementById('boardSelectionModal');
  var modal = new bootstrap.Modal(modalEl);
  modal.show();
}

function selectBoard(boardId) {
  ensureMasterGeneratorSetCaptured();
  setSelectedBoard(boardId);
  
  var boardSelector = document.getElementById('boardSelector');
  if (boardSelector) {
    boardSelector.value = boardId;
  }
  
  updateBoardInfoDisplay(boardId);
  updatePinReferencePanel();
  
  if (boardId === 'esp32-s3-devkitc1' || boardId === 'playground-brumbrum-esp32-s3-devkitc1') {
    profile['default'] = profile['esp32'];
  } else if (boardId === 'arduino-uno') {
    profile['default'] = profile['arduino'];
  }
  
  updateToolboxForBoard(boardId);
  updateGeneratorsForBoard(boardId);
  
  var modalEl = document.getElementById('boardSelectionModal');
  var modal = bootstrap.Modal.getInstance(modalEl);
  if (modal) {
    modal.hide();
  }
  
  var boardSelectorContainer = document.getElementById('boardSelector');
  if (boardSelectorContainer) {
    boardSelectorContainer.style.display = 'none';
  }
  
  window.setTimeout(ensureProgramStructure, 100);
}

function updateToolboxForBoard(boardId) {
  if (!Blockly.mainWorkspace) return;
  
  if (!window.originalToolbox) return;
  
  var toolboxClone = window.originalToolbox.cloneNode(true);
  var categories = toolboxClone.querySelectorAll('category[data-board]');
  
  categories.forEach(function(category) {
    var requiredBoard = category.getAttribute('data-board');
    if (requiredBoard !== boardId) {
      category.parentNode.removeChild(category);
    } else {
      category.removeAttribute('data-board');
    }
  });
  
  // Apply translations to the toolbox
  var allCategories = toolboxClone.querySelectorAll('category[data-i18n-name]');
  allCategories.forEach(function(category) {
    var key = category.getAttribute('data-i18n-name');
    var translation = i18n.t(key);
    category.setAttribute('name', translation);
  });
  
  Blockly.mainWorkspace.updateToolbox(toolboxClone);
  
  // Re-add icons after toolbox update
  window.setTimeout(function() {
    if (typeof addToolboxIcons === 'function') {
      addToolboxIcons();
    }
    if (typeof updateToolboxTree === 'function') {
      updateToolboxTree();
    }
  }, 100);
}

function initBoardSelection() {
  var savedBoard = getSelectedBoard();
  var boardSelector = document.getElementById('boardSelector');
  
  if (savedBoard) {
    selectedBoard = savedBoard;
    if (boardSelector) {
      boardSelector.value = savedBoard;
      boardSelector.style.display = 'none';
    }
    updateBoardInfoDisplay(savedBoard);
    if (savedBoard === 'esp32-s3-devkitc1' || savedBoard === 'playground-brumbrum-esp32-s3-devkitc1') {
      profile['default'] = profile['esp32'];
    } else if (savedBoard === 'arduino-uno') {
      profile['default'] = profile['arduino'];
    }
    window.setTimeout(function() {
      updateToolboxForBoard(savedBoard);
    }, 200);
  } else {
    if (boardSelector) {
      boardSelector.style.display = 'none';
    }
    window.setTimeout(showBoardSelectionModal, 300);
  }
}

function addWarning(title, message) {
  sessionWarnings.push({ title: title, message: message });
  updateWarningsButton();
}

function updateWarningsButton() {
  var btn = document.getElementById('warningsBtn');
  if (btn) {
    if (sessionWarnings.length > 0) {
      btn.classList.remove('d-none');
    } else {
      btn.classList.add('d-none');
    }
  }
}

function showWarningsModal() {
  var modalEl = document.getElementById('warningsModal');
  var modal = new bootstrap.Modal(modalEl);
  var list = document.getElementById('warningsList');
  
  list.innerHTML = '';
  sessionWarnings.forEach(function(warning) {
    var li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerHTML = '<strong>' + warning.title + '</strong><br><small class="text-muted">' + warning.message + '</small>';
    list.appendChild(li);
  });
  
  var cleanup = function() {
    var backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();
    document.body.classList.remove('modal-open');
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    modalEl.removeEventListener('hidden.bs.modal', cleanup);
    modal.dispose();
  };
  
  modalEl.addEventListener('hidden.bs.modal', cleanup);
  modal.show();
}

/**
 * Backup code blocks to localStorage.
 */
function backup_blocks() {
  if ('localStorage' in window) {
    var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    annotateXmlWithBoard(xml);
    window.localStorage.setItem('arduino', Blockly.Xml.domToText(xml));
  }
}

/**
 * Restore code blocks from localStorage.
 */
function restore_blocks() {
  if ('localStorage' in window && window.localStorage.arduino) {
    var xml = Blockly.Xml.textToDom(window.localStorage.arduino);
    applyBoardSelectionFromXml(xml);
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
  }
}

/**
* Save Arduino generated code to local file.
*/
function saveCode() {
  showPromptModal('What would you like to name your file?', 'BlocklyDuino', function(fileName) {
    var blob = new Blob([Blockly.Arduino.workspaceToCode()], {type: 'text/plain;charset=utf-8'});
    saveAs(blob, fileName + '.ino');
  });
}

/**
* Save complete PlatformIO project as ZIP.
*/
function saveProject() {
  // Check for unsatisfied dependencies first
  var unsatisfied = checkAllDependencies();
  if (unsatisfied.length > 0) {
    var depList = '';
    for (var i = 0; i < unsatisfied.length; i++) {
      depList += '• ' + i18n.t(unsatisfied[i].message) + '\n';
    }
    var warningMessage = i18n.t('messages.dependencyWarning', { dependencies: depList });
    showBlockWarningModal(warningMessage, function() {
      proceedWithDownload();
    });
    return;
  }
  
  proceedWithDownload();
}

function proceedWithDownload() {
  var includes = getRequiredIncludes();
  if (includes.length > 0) {
    var includeList = '';
    for (var i = 0; i < includes.length; i++) {
      includeList += '• #include "' + includes[i] + '"\n';
    }
    var summaryMessage = i18n.t('messages.downloadSummary', { includes: includeList });
    showConfirmModal(summaryMessage, function() {
      showPromptModal(i18n.t('messages.projectName'), 'MyProject', function(fileName) {
        doSaveProject(fileName);
      });
    });
  } else {
    showPromptModal(i18n.t('messages.projectName'), 'MyProject', function(fileName) {
      doSaveProject(fileName);
    });
  }
}

/**
* Internal function to save project.
*/
async function doSaveProject(fileName) {
  var boardSelector = document.getElementById('boardSelector');
  var savedBoard = selectedBoard;
  if (!savedBoard && typeof getSelectedBoard === 'function') {
    savedBoard = getSelectedBoard();
  }
  var boardId = savedBoard || (boardSelector ? boardSelector.value : null);
  if (!boardId || !BOARD_TEMPLATES[boardId]) {
    boardId = (boardSelector && boardSelector.value) ? boardSelector.value : 'esp32-s3-devkitc1';
  }
  if (boardSelector && boardSelector.value !== boardId) {
    boardSelector.value = boardId;
  }
  var arduinoCode = Blockly.Arduino.workspaceToCode(Blockly.mainWorkspace);

  var zip = new JSZip();

  // Get template from embedded templates
  var template = BOARD_TEMPLATES[boardId];
  
  if (template) {
    for (var filepath in template) {
      zip.file(filepath, template[filepath]);
    }
  }

  // Always add src/main.cpp with generated code
  var newMain = '#include <Arduino.h>\n';
  // Add includes for servo and LED if used
  if (arduinoCode.includes('initializeServos') || arduinoCode.includes('setServoAngle') || arduinoCode.includes('readServoAngle') || arduinoCode.includes('testServoSweep')) {
    newMain += '#include "servos.h"\n';
  }
  if (arduinoCode.includes('initializeLED') || arduinoCode.includes('setLED') || arduinoCode.includes('turnOffLED') || arduinoCode.includes('runLEDInitTest')) {
    newMain += '#include "internalLED.h"\n';
  }
  if (arduinoCode.includes('SW1_PIN') || arduinoCode.includes('SW2_PIN') || arduinoCode.includes('SW3_PIN') || arduinoCode.includes('SW4_PIN')) {
    newMain += '#include "buttons.h"\n';
  }
  if (arduinoCode.includes('initializeLEDMatrix') || arduinoCode.includes('setLEDMatrixPixel') || arduinoCode.includes('fillLEDMatrix') || arduinoCode.includes('showLEDMatrix') || arduinoCode.includes('turnOffLEDMatrix') || arduinoCode.includes('runLEDMatrixTest')) {
    newMain += '#include "LEDMatrix.h"\n';
  }
  if (arduinoCode.includes('initOLED') || arduinoCode.includes('writeToOled') || arduinoCode.includes('clearOled') || arduinoCode.includes('testOLED')) {
    newMain += '#include "oled.h"\n';
  }
  newMain += '\n' + arduinoCode;
  zip.file('src/main.cpp', newMain);

  if (!template) {
    // Fallback for unknown boards - add platformio.ini and other files
    var platformioContent = '; PlatformIO Project Configuration File\n; https://docs.platformio.org/page/projectconf.html\n\n[env:uno]\nplatform = atmelavr\nboard = uno\nframework = arduino\nmonitor_speed = 9600\n';
    zip.file('platformio.ini', platformioContent);
    zip.file('.vscode/settings.json', JSON.stringify({
      "editor.tabSize": 2,
      "files.associations": {
        "*.ino": "cpp"
      }
    }, null, 2));
    zip.file('.gitignore', '.pio\n.vscode/.browse.c_cpp.db*\n.vscode/c_cpp_properties.json\n.vscode/launch.json\n.vscode/ipch\n');
  }

  // Generate ZIP and trigger download
  var content = await zip.generateAsync({type: 'blob'});
  saveAs(content, fileName + '.zip');
}

/**
 * Save blocks to local file.
 * better include Blob and FileSaver for browser compatibility
 */
function save() {
  var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
  annotateXmlWithBoard(xml);
  var data = Blockly.Xml.domToText(xml);
  showPromptModal(i18n.t('messages.fileName'), 'BlocklyDuino', function(fileName) {
    var blob = new Blob([data], {type: 'text/xml'});
    saveAs(blob, fileName + ".xml");
  });
}

/**
 * Load blocks from local file.
 */
function load(event) {
  var files = event.target.files;
  // Only allow uploading one file.
  if (files.length != 1) {
    return;
  }

  // FileReader
  var reader = new FileReader();
  reader.onloadend = function(event) {
    var target = event.target;
    // 2 == FileReader.DONE
    if (target.readyState == 2) {
      try {
        var xml = Blockly.Xml.textToDom(target.result);
      } catch (e) {
        showAlertModal(i18n.t('messages.errorParsingXML', { error: e }));
        return;
      }
      var count = Blockly.mainWorkspace.getAllBlocks().length;
      if (count) {
        showConfirmModal(i18n.t('messages.replaceBlocks'), function() {
          Blockly.mainWorkspace.clear();
          loadXmlToWorkspace(xml);
        });
        return;
      }
      loadXmlToWorkspace(xml);
    }
    // Reset value of input after loading because Chrome will not fire
    // a 'change' event if the same file is loaded again.
    document.getElementById('load').value = '';
  };
  reader.readAsText(files[0]);
}

/**
 * Load XML to workspace.
 */
function loadXmlToWorkspace(xml) {
  applyBoardSelectionFromXml(xml);
  Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
}

/**
 * Discard all blocks from the workspace.
 */
function discard() {
  var count = Blockly.mainWorkspace.getAllBlocks().length;
  if (count < 2) {
    clearWorkspace();
  } else {
    showConfirmModal(i18n.t('messages.deleteAllBlocks', { count: count }), function() {
      clearWorkspace();
    });
  }
}

/**
 * Clear workspace and recreate structure blocks.
 */
function clearWorkspace() {
  clearSelectedBoard();
  Blockly.mainWorkspace.clear();
  var boardSelector = document.getElementById('boardSelector');
  if (boardSelector) {
    boardSelector.style.display = 'none';
  }
  var boardInfo = document.getElementById('boardInfo');
  if (boardInfo) {
    boardInfo.style.display = 'none';
  }
  window.setTimeout(showBoardSelectionModal, 100);
  renderContent();
}

/*
 * auto save and restore blocks
 */
function auto_save_and_restore_blocks() {
  // Restore saved blocks in a separate thread so that subsequent
  // initialization is not affected from a failed load.
  window.setTimeout(restore_blocks, 0);
  // Hook a save function onto unload.
  bindEvent(window, 'unload', backup_blocks);
  tabClick(selected);

  // Init load event.
  var loadInput = document.getElementById('load');
  loadInput.addEventListener('change', load, false);
  document.getElementById('fakeload').onclick = function() {
    loadInput.click();
  };

  initBoardSelection();

  // Ensure setup and loop blocks exist
  window.setTimeout(ensureProgramStructure, 100);

  // Set up block info listener
  window.setTimeout(setupBlockInfoListener, 150);
}

function setupBlockInfoListener() {
  if (!Blockly.mainWorkspace) {
    window.setTimeout(setupBlockInfoListener, 100);
    return;
  }

  var lastBlockCount = 0;
  var lastBlockIds = {};

  function checkForNewBlocks() {
    if (!Blockly.mainWorkspace) return;
    
    var blocks = Blockly.mainWorkspace.getAllBlocks();
    var currentBlockIds = {};
    
    for (var i = 0; i < blocks.length; i++) {
      var block = blocks[i];
      currentBlockIds[block.id] = block.type;
      
      if (!lastBlockIds[block.id]) {
        if (hasBlockInfo(block.type) && !seenBlocks.has(block.type)) {
          var info = getBlockInfo(block.type);
          var warningKey = info && info.warningKey ? info.warningKey : block.type;
          
          if (!seenBlocks.has(warningKey)) {
            seenBlocks.add(warningKey);
            seenBlocks.add(block.type);
            if (info) {
              var title = i18n.t(info.title);
              var message = i18n.t(info.message);
              showBlockInfoModal(title, message);
            }
          } else {
            seenBlocks.add(block.type);
          }
        }
        
        // Check for dependency
        if (hasBlockDependency(block.type)) {
          var depResult = checkDependencySatisfied(block.type);
          if (!depResult.satisfied) {
            var message = i18n.t(depResult.message);
            showBlockWarningModal(message);
          }
        }
      }
    }
    
    lastBlockIds = currentBlockIds;
  }

  Blockly.mainWorkspace.addChangeListener(function() {
    window.setTimeout(checkForNewBlocks, 10);
  });

  checkForNewBlocks();
}

/**
 * Ensure setup, loop, header, interrupts, and functions blocks are present in the workspace.
 */
function ensureProgramStructure() {
  if (!Blockly.mainWorkspace) {
    return;
  }

  var blocks = Blockly.mainWorkspace.getAllBlocks();
  var hasSetup = false;
  var hasLoop = false;
  var hasHeader = false;
  var hasInterrupts = false;
  var hasFunctions = false;

  for (var i = 0; i < blocks.length; i++) {
    if (blocks[i].type === 'arduino_setup') {
      hasSetup = true;
    }
    if (blocks[i].type === 'arduino_loop') {
      hasLoop = true;
    }
    if (blocks[i].type === 'arduino_header') {
      hasHeader = true;
    }
    if (blocks[i].type === 'arduino_interrupts') {
      hasInterrupts = true;
    }
    if (blocks[i].type === 'arduino_functions') {
      hasFunctions = true;
    }
  }

  // Create header block if missing - positioned at top left
  if (!hasHeader) {
    var headerBlock = Blockly.Block.obtain(Blockly.mainWorkspace, 'arduino_header');
    headerBlock.initSvg();
    headerBlock.render();
    headerBlock.moveBy(138, 13);
  }

  // Create interrupts block if missing - positioned at middle right
  if (!hasInterrupts) {
    var interruptsBlock = Blockly.Block.obtain(Blockly.mainWorkspace, 'arduino_interrupts');
    interruptsBlock.initSvg();
    interruptsBlock.render();
    interruptsBlock.moveBy(863, 238);
  }

  // Create functions block if missing - positioned at top right
  if (!hasFunctions) {
    var functionsBlock = Blockly.Block.obtain(Blockly.mainWorkspace, 'arduino_functions');
    functionsBlock.initSvg();
    functionsBlock.render();
    functionsBlock.moveBy(863, 13);
  }

  // Create setup block if missing - positioned at middle left
  if (!hasSetup) {
    var setupBlock = Blockly.Block.obtain(Blockly.mainWorkspace, 'arduino_setup');
    setupBlock.initSvg();
    setupBlock.render();
    setupBlock.moveBy(138, 238);
  }

  // Create loop block if missing - positioned at bottom left
  if (!hasLoop) {
    var loopBlock = Blockly.Block.obtain(Blockly.mainWorkspace, 'arduino_loop');
    loopBlock.initSvg();
    loopBlock.render();
    loopBlock.moveBy(138, 513);
  }
}

/**
 * Bind an event to a function call.
 * @param {!Element} element Element upon which to listen.
 * @param {string} name Event name to listen to (e.g. 'mousedown').
 * @param {!Function} func Function to call when event is triggered.
 *     W3 browsers will call the function with the event object as a parameter,
 *     MSIE will not.
 */
function bindEvent(element, name, func) {
  if (element.addEventListener) {  // W3C
    element.addEventListener(name, func, false);
  } else if (element.attachEvent) {  // IE
    element.attachEvent('on' + name, func);
  }
}

//loading examples via ajax
var ajax;
function createAJAX() {
  if (window.ActiveXObject) { //IE
    try {
      return new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      try {
        return new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e2) {
        return null;
      }
    }
  } else if (window.XMLHttpRequest) {
    return new XMLHttpRequest();
  } else {
    return null;
  }
}

function onSuccess() {
  if (ajax.readyState == 4) {
    if (ajax.status == 200) {
      try {
      var xml = Blockly.Xml.textToDom(ajax.responseText);
      } catch (e) {
        showAlertModal(i18n.t('messages.errorParsingXML', { error: e }));
        return;
      }
      var count = Blockly.mainWorkspace.getAllBlocks().length;
      if (count) {
        showConfirmModal(i18n.t('messages.replaceBlocks'), function() {
          Blockly.mainWorkspace.clear();
          Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
        });
        return;
      }
      Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
    } else {
      showAlertModal(i18n.t('messages.serverError'));
    }
  }
}

function load_by_url(uri) {
  ajax = createAJAX();
  if (!ajax) {
    showAlertModal(i18n.t('messages.notCompatible'));
    return 0;
  }
  if (ajax.overrideMimeType) {
    ajax.overrideMimeType('text/xml');
  }

  ajax.onreadystatechange = onSuccess;
  ajax.open("GET", uri, true);
  ajax.send("");
}

/**
 * Shake animation for blocks when connection is rejected due to type mismatch.
 */
var shakeAnimation = {
  shakingBlock: null,
  rejectedContainerBlock: null,
  
  shake: function(block) {
    if (!block || !block.getSvgRoot) return;
    
    var svgRoot = block.getSvgRoot();
    if (!svgRoot) return;
    
    if (this.shakingBlock === block) return;
    this.shakingBlock = block;
    
    var xy = block.getRelativeToSurfaceXY();
    var shakeAmount = 6;
    var shakeCount = 3;
    var shakeDuration = 60;
    
    var shakeIndex = 0;
    var self = this;
    
    function doShake() {
      if (shakeIndex >= shakeCount * 2) {
        svgRoot.setAttribute('transform', 'translate(' + xy.x + ', ' + xy.y + ')');
        self.shakingBlock = null;
        return;
      }
      
      var offset = (shakeIndex % 2 === 0) ? shakeAmount : -shakeAmount;
      svgRoot.setAttribute('transform', 'translate(' + (xy.x + offset) + ', ' + xy.y + ')');
      shakeIndex++;
      setTimeout(doShake, shakeDuration);
    }
    
    doShake();
  }
};

/**
 * Override Blockly's closest function to detect rejected connections near container blocks.
 */
(function() {
  var originalClosest = Blockly.Connection.prototype.closest;
  
  Blockly.Connection.prototype.closest = function(maxLimit, dx, dy) {
    var result = originalClosest.call(this, maxLimit, dx, dy);
    
    var selected = Blockly.selected;
    if (!selected) return result;
    
    if (result.connection) {
      var sourceBlock = result.connection.sourceBlock_;
      if (sourceBlock && 
          (sourceBlock.type === 'arduino_header' || 
           sourceBlock.type === 'arduino_setup' || 
           sourceBlock.type === 'arduino_loop' ||
           sourceBlock.type === 'arduino_interrupts' ||
           sourceBlock.type === 'arduino_functions')) {
        shakeAnimation.rejectedContainerBlock = null;
        return result;
      }
    }
    
    var myConnections = selected.getConnections_(false);
    var foundRejected = false;
    
    for (var i = 0; i < myConnections.length; i++) {
      var myConn = myConnections[i];
      if (myConn.type !== Blockly.NEXT_STATEMENT && myConn.type !== Blockly.PREVIOUS_STATEMENT) continue;
      
      var db = this.dbList_[Blockly.OPPOSITE_TYPE[myConn.type]];
      if (!db) continue;
      
      var currentX = myConn.x_ + dx;
      var currentY = myConn.y_ + dy;
      
      for (var j = 0; j < db.length; j++) {
        var otherConn = db[j];
        var distX = currentX - otherConn.x_;
        var distY = currentY - otherConn.y_;
        var dist = Math.sqrt(distX * distX + distY * distY);
        
        if (dist < Blockly.SNAP_RADIUS * 2) {
          var sourceBlock = otherConn.sourceBlock_;
          if (sourceBlock && 
              (sourceBlock.type === 'arduino_header' || 
               sourceBlock.type === 'arduino_setup' || 
               sourceBlock.type === 'arduino_loop' ||
               sourceBlock.type === 'arduino_interrupts' ||
               sourceBlock.type === 'arduino_functions')) {
            
            if (myConn.check_ && otherConn.check_) {
              var hasMatch = false;
              for (var k = 0; k < myConn.check_.length; k++) {
                if (otherConn.check_.indexOf(myConn.check_[k]) !== -1) {
                  hasMatch = true;
                  break;
                }
              }
              if (!hasMatch) {
                shakeAnimation.rejectedContainerBlock = sourceBlock;
                foundRejected = true;
                break;
              }
            }
          }
        }
      }
      if (foundRejected) break;
    }
    
    return result;
  };
})();

/**
 * Override Blockly's terminateDrag_ to add shake effect on type mismatch.
 */
(function() {
  var originalTerminateDrag = Blockly.BlockSvg.terminateDrag_;
  
  Blockly.BlockSvg.terminateDrag_ = function() {
    if (shakeAnimation.rejectedContainerBlock && !Blockly.highlightedConnection_) {
      shakeAnimation.shake(shakeAnimation.rejectedContainerBlock);
    }
    shakeAnimation.rejectedContainerBlock = null;
    
    originalTerminateDrag.call(this);
  };
})();
