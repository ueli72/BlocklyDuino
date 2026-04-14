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
  'generators/arduino/playground_brumbrum/pins_brumbrum.js',
  'generators/arduino/playground_brumbrum/sg90.js',
  'generators/arduino/playground_brumbrum/internal_led.js',
  'generators/arduino/playground_brumbrum/button.js',
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

var ESP32_CONTROLLER_GENERATOR_SCRIPTS = [
  'generators/arduino/playground_esp32_controller/pins_esp32_controller.js',
  'generators/arduino/playground_esp32_controller/sg90.js',
  'generators/arduino/playground_esp32_controller/internal_led.js',
  'generators/arduino/playground_esp32_controller/button.js',
  'generators/arduino/playground_esp32_controller/dc_motor.js',
  'generators/arduino/playground_esp32_controller/ultrasonic.js',
  'generators/arduino/playground_esp32_controller/sdcard.js',
  'generators/arduino/playground_esp32_controller/max98357a.js',
  'generators/arduino/playground_esp32_controller/brightness.js',
  'generators/arduino/playground_esp32_controller/ws2812.js',
  'generators/arduino/playground_esp32_controller/ble_remote.js',
  'generators/arduino/playground_esp32_controller/test_all.js',
  'generators/arduino/playground_esp32_controller/timer.js',
  'generators/arduino/playground_esp32_controller/ky023.js',
  'generators/arduino/playground_esp32_controller/serial.js',
  'generators/arduino/playground_esp32_controller/variable.js',
  'generators/arduino/playground_esp32_controller/global_array.js',
  'generators/arduino/playground_esp32_controller/custom_code.js'
];
var esp32ControllerGeneratorsLoading = null;

var ARDUINO_UNO_GENERATOR_SCRIPTS = [
  'generators/arduino/arduino-uno/pins_uno.js',
  'generators/arduino/arduino-uno/button.js'
];
var arduinoUnoGeneratorsLoading = null;

var BOARD_INFO = {
  'esp32-s3-devkitc1': {
    name: 'BWS Playground Master',
    image: 'media/playground.png'
  },
  'playground-brumbrum-esp32-s3-devkitc1': {
    name: 'Playground BrumBrum (esp32-s3-devkitc1)',
    image: 'media/brumbrum.png'
  },
  'esp32-controller': {
    name: 'ESP32-Controller',
    image: 'media/esp32-controller.jpg'
  },
  'arduino-uno': {
    name: 'Arduino Uno',
    image: 'media/uno.jpg'
  }
};

var PIN_DATA_FILES = {
  'esp32-s3-devkitc1': 'generators/arduino/playground/pins_playground.js',
  'playground-brumbrum-esp32-s3-devkitc1': 'generators/arduino/playground_brumbrum/pins_brumbrum.js',
  'esp32-controller': 'generators/arduino/playground_esp32_controller/pins_esp32_controller.js',
  'arduino-uno': 'generators/arduino/arduino-uno/pins_uno.js'
};

var loadedPinData = {};
var currentPinData = null;

function loadPinDataFile(boardId) {
  return new Promise(function(resolve, reject) {
    if (loadedPinData[boardId]) {
      resolve(loadedPinData[boardId]);
      return;
    }
    
    var path = PIN_DATA_FILES[boardId];
    if (!path) {
      reject(new Error('No pin data file defined for board: ' + boardId));
      return;
    }
    
    var script = document.createElement('script');
    script.src = path;
    script.onload = function() {
      // The pin data file should set a global variable
      var pinData = null;
      if (boardId === 'esp32-s3-devkitc1') {
        pinData = window.PIN_DATA_PLAYGROUND;
      } else if (boardId === 'playground-brumbrum-esp32-s3-devkitc1') {
        pinData = window.PIN_DATA_BRUMBRUM;
      } else if (boardId === 'esp32-controller') {
        pinData = window.PIN_DATA_ESP32_CONTROLLER;
      } else if (boardId === 'arduino-uno') {
        pinData = window.PIN_DATA_UNO;
      }
      
      if (pinData) {
        loadedPinData[boardId] = pinData;
        resolve(pinData);
      } else {
        reject(new Error('Pin data not loaded for board: ' + boardId));
      }
    };
    script.onerror = function() {
      reject(new Error('Failed to load pin data file: ' + path));
    };
    document.head.appendChild(script);
  });
}

function setCurrentPinData(boardId) {
  if (loadedPinData[boardId]) {
    currentPinData = loadedPinData[boardId];
  }
}

function getCurrentPinData() {
  return currentPinData;
}

// Backward compatibility: get pin info for the current board
function getPinInfo(boardId, pin) {
  // If only one argument provided, use current board
  if (arguments.length === 1) {
    pin = boardId;
    boardId = getActiveBoardId();
  }
  
  var data = loadedPinData[boardId];
  if (!data || !data.pins[pin]) return null;
  return data.pins[pin];
}

function getPinTooltip(boardId, pin) {
  // If only one argument provided, use current board
  if (arguments.length === 1) {
    pin = boardId;
    boardId = getActiveBoardId();
  }
  
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

// Helper functions for common blocks to get pin dropdowns for current board
function getCurrentBoardPinOptions() {
  var boardId = getActiveBoardId();
  var data = loadedPinData[boardId];
  if (!data) return [];
  
  var options = [];
  Object.keys(data.pins).forEach(function(pinKey) {
    var pin = data.pins[pinKey];
    options.push([pin.name + (pin.special.length > 0 ? ' - ' + pin.special.join(', ') : ''), pinKey]);
  });
  return options;
}

function getCurrentBoardDigitalPinOptions() {
  var boardId = getActiveBoardId();
  var data = loadedPinData[boardId];
  if (!data) return [];
  
  var options = [];
  Object.keys(data.pins).forEach(function(pinKey) {
    var pin = data.pins[pinKey];
    if (pin.capabilities && pin.capabilities.includes('digital')) {
      options.push([pin.name + (pin.special.length > 0 ? ' - ' + pin.special.join(', ') : ''), pinKey]);
    }
  });
  return options;
}

function getCurrentBoardPwmPinOptions() {
  var boardId = getActiveBoardId();
  var data = loadedPinData[boardId];
  if (!data) return [];
  
  var options = [];
  Object.keys(data.pins).forEach(function(pinKey) {
    var pin = data.pins[pinKey];
    if (pin.capabilities && pin.capabilities.includes('pwm')) {
      options.push([pin.name + (pin.special.length > 0 ? ' - ' + pin.special.join(', ') : ''), pinKey]);
    }
  });
  return options;
}

function getCurrentBoardAnalogPinOptions() {
  var boardId = getActiveBoardId();
  var data = loadedPinData[boardId];
  if (!data) return [];
  
  var options = [];
  var analogCaps = ['analog', 'adc1', 'adc2'];
  Object.keys(data.pins).forEach(function(pinKey) {
    var pin = data.pins[pinKey];
    if (pin.capabilities && pin.capabilities.some(function(cap) { return analogCaps.includes(cap); })) {
      options.push([pin.name + (pin.special.length > 0 ? ' - ' + pin.special.join(', ') : ''), pinKey]);
    }
  });
  return options;
}

function getCurrentBoardInterruptPinOptions() {
  var boardId = getActiveBoardId();
  var data = loadedPinData[boardId];
  if (!data) return [];
  
  var options = [];
  Object.keys(data.pins).forEach(function(pinKey) {
    var pin = data.pins[pinKey];
    if (pin.capabilities && pin.capabilities.includes('interrupt')) {
      options.push([pin.name + (pin.special.length > 0 ? ' - ' + pin.special.join(', ') : ''), pinKey]);
    }
  });
  return options;
}

function captureGeneratorSet(name) {
  if (typeof Blockly === 'undefined' || !Blockly.Arduino) return;
  var set = {};
  Object.keys(Blockly.Arduino).forEach(function(key) {
    var value = Blockly.Arduino[key];
    if (typeof value === 'function') {
      // Store reference - functions from different files are already different objects
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

  brumbrumGeneratorsLoading = loadScriptsSequential(BRUMBRUM_GENERATOR_SCRIPTS).then(function() {
    // Now that brumbrum scripts have loaded and overwritten Blockly.Arduino functions,
    // capture them as the 'brumbrum' set
    captureGeneratorSet('brumbrum');
  }).catch(function(error) {
    console.error('Failed to load BrumBrum generator scripts', error);
  }).finally(function() {
    brumbrumGeneratorsLoading = null;
  });

  return brumbrumGeneratorsLoading;
}

function ensureESP32ControllerGeneratorsLoaded() {
  ensureMasterGeneratorSetCaptured();
  if (GENERATOR_SETS.esp32controller) {
    return Promise.resolve();
  }
  if (esp32ControllerGeneratorsLoading) {
    return esp32ControllerGeneratorsLoading;
  }

  esp32ControllerGeneratorsLoading = loadScriptsSequential(ESP32_CONTROLLER_GENERATOR_SCRIPTS).then(function() {
    captureGeneratorSet('esp32controller');
  }).catch(function(error) {
    console.error('Failed to load ESP32-Controller generator scripts', error);
  }).finally(function() {
    esp32ControllerGeneratorsLoading = null;
  });

  return esp32ControllerGeneratorsLoading;
}

function ensureArduinoUnoGeneratorsLoaded() {
  ensureMasterGeneratorSetCaptured();
  if (GENERATOR_SETS.arduinouno) {
    return Promise.resolve();
  }
  if (arduinoUnoGeneratorsLoading) {
    return arduinoUnoGeneratorsLoading;
  }

  arduinoUnoGeneratorsLoading = loadScriptsSequential(ARDUINO_UNO_GENERATOR_SCRIPTS).then(function() {
    captureGeneratorSet('arduinouno');
  }).catch(function(error) {
    console.error('Failed to load Arduino Uno generator scripts', error);
  }).finally(function() {
    arduinoUnoGeneratorsLoading = null;
  });

  return arduinoUnoGeneratorsLoading;
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
  } else if (boardId === 'esp32-controller') {
    ensureESP32ControllerGeneratorsLoaded().then(function() {
      if (GENERATOR_SET_TARGET === 'esp32-controller') {
        applyGeneratorSet('esp32controller');
      }
    });
  } else if (boardId === 'arduino-uno') {
    ensureArduinoUnoGeneratorsLoaded().then(function() {
      if (GENERATOR_SET_TARGET === 'arduino-uno') {
        applyGeneratorSet('arduinouno');
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
  var boardData = loadedPinData[boardId];
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

function createPinReferencePanel() {
  if (document.getElementById('pinReferencePanel')) return;
  
  var boardId = getSelectedBoard() || 'esp32-s3-devkitc1';
  var boardData = loadedPinData[boardId];
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
  
  // Derive capabilities dynamically from pin data
  var capFilterContainer = document.createElement('div');
  capFilterContainer.className = 'pin-reference-cap-filters';
  capFilterContainer.id = 'pinCapFilters';
  
  // Collect unique capabilities from all pins
  var allCapabilities = new Set();
  Object.values(boardData.pins).forEach(function(pin) {
    if (pin.capabilities) {
      pin.capabilities.forEach(function(cap) { allCapabilities.add(cap); });
    }
  });
  
  Array.from(allCapabilities).sort().forEach(function(cap) {
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
  
  // Derive table headers from first pin's properties
  var thead = document.createElement('thead');
  var samplePin = Object.values(boardData.pins)[0];
  var headers = ['Pin'];
  if (samplePin && samplePin.capabilities) headers.push('Capabilities');
  if (samplePin && samplePin.special) headers.push('Special');
  if (samplePin && samplePin.notes !== undefined) headers.push('Notes');
  
  var headerRow = document.createElement('tr');
  headers.forEach(function(h) {
    var th = document.createElement('th');
    var i18nKey = 'pinReference.' + h.toLowerCase();
    th.textContent = typeof i18n !== 'undefined' ? i18n.t(i18nKey) : h;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
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
    tr.dataset.capabilities = (pin.capabilities || []).join(' ').toLowerCase();
    tr.dataset.special = (pin.special || []).join(' ').toLowerCase();
    tr.dataset.notes = (pin.notes || '').toLowerCase();
    if (pin.reserved) tr.classList.add('pin-reserved');
    
    var html = '<td><strong>' + pin.name + '</strong></td>';
    
    if (pin.capabilities) {
      var capHtml = pin.capabilities.map(function(cap) {
        return '<span class="pin-cap pin-cap-' + cap + '">' + cap + '</span>';
      }).join(' ');
      html += '<td>' + capHtml + '</td>';
    }
    
    if (samplePin.special !== undefined) {
      html += '<td>' + (pin.special ? pin.special.join('<br>') : '') + '</td>';
    }
    
    if (samplePin.notes !== undefined) {
      html += '<td>' + (pin.notes || '') + '</td>';
    }
    
    tr.innerHTML = html;
    tbody.appendChild(tr);
  });
  
  table.appendChild(tbody);
  content.appendChild(table);
  panel.appendChild(content);
  
  document.body.appendChild(panel);
}

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
  
  // Load pin data for this board
  loadPinDataFile(boardId).then(function(pinData) {
    setCurrentPinData(boardId);
    updatePinReferencePanel();
  }).catch(function(error) {
    console.warn('Could not load pin data:', error);
  });
  
  updateBoardInfoDisplay(boardId);
  
  if (boardId === 'esp32-s3-devkitc1' || boardId === 'playground-brumbrum-esp32-s3-devkitc1' || boardId === 'esp32-controller') {
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
    var isMatch = requiredBoard === boardId;
    if (!isMatch) {
      category.parentNode.removeChild(category);
    } else {
      category.removeAttribute('data-board');
    }
  });
  
  var excludedCategories = toolboxClone.querySelectorAll('category[data-board-exclude]');
  excludedCategories.forEach(function(category) {
    var excludedBoards = category.getAttribute('data-board-exclude');
    if (excludedBoards && excludedBoards.split(',').map(function(b) { return b.trim(); }).indexOf(boardId) !== -1) {
      category.parentNode.removeChild(category);
    } else {
      category.removeAttribute('data-board-exclude');
    }
  });
  
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
    
    // Load pin data for saved board
    loadPinDataFile(savedBoard).then(function(pinData) {
      setCurrentPinData(savedBoard);
    }).catch(function(error) {
      console.warn('Could not load pin data for saved board:', error);
    });
    
    if (savedBoard === 'esp32-s3-devkitc1' || savedBoard === 'playground-brumbrum-esp32-s3-devkitc1' || savedBoard === 'esp32-controller') {
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
