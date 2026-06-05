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
  'generators/arduino/playground_brumbrum/pins_playground_brumbrum.js',
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
  'generators/arduino/playground_master/cast.js',
  'generators/arduino/playground_brumbrum/test_all.js',
  'generators/arduino/playground_brumbrum/timer.js',
  'generators/arduino/playground_brumbrum/ky023.js',
  'generators/arduino/playground_brumbrum/serial.js',
  'generators/arduino/playground_brumbrum/variable.js',
  'generators/arduino/playground_brumbrum/global_array.js',
  'generators/arduino/playground_brumbrum/custom_code.js'
];
var brumbrumGeneratorsLoading = null;

var PLAYGROUND_CONTROLLER_GENERATOR_SCRIPTS = [
  'generators/arduino/playground_controller/pins_playground_controller.js',
  'generators/arduino/playground_controller/sg90.js',
  'generators/arduino/playground_controller/internal_led.js',
  'generators/arduino/playground_controller/button.js',
  'generators/arduino/playground_controller/dc_motor.js',
  'generators/arduino/playground_controller/ultrasonic.js',
  'generators/arduino/playground_controller/sdcard.js',
  'generators/arduino/playground_controller/max98357a.js',
  'generators/arduino/playground_controller/brightness.js',
  'generators/arduino/playground_controller/ws2812.js',
  'generators/arduino/playground_controller/ble_remote.js',
  'generators/arduino/playground_controller/ble_client.js',
  'generators/arduino/playground_controller/oled.js',
  'generators/arduino/playground_controller/haptic.js',
  'generators/arduino/playground_controller/menu.js',
  'generators/arduino/playground_master/cast.js',
  'generators/arduino/playground_controller/test_all.js',
  'generators/arduino/playground_controller/timer.js',
  'generators/arduino/playground_controller/ky023.js',
  'generators/arduino/playground_controller/serial.js',
  'generators/arduino/playground_controller/variable.js',
  'generators/arduino/playground_controller/global_array.js',
  'generators/arduino/playground_controller/custom_code.js'
];
var playgroundControllerGeneratorsLoading = null;

var ARDUINO_UNO_GENERATOR_SCRIPTS = [
  'generators/arduino/arduino-uno/pins_uno.js',
  'generators/arduino/arduino-uno/button.js'
];
var arduinoUnoGeneratorsLoading = null;

var PLAYGROUND_MASTER_GENERATOR_SCRIPTS = [
  'generators/arduino/playground_master/pins_playground_master.js',
  'generators/arduino/playground_master/sg90.js',
  'generators/arduino/playground_master/internal_led.js',
  'generators/arduino/playground_master/button.js',
  'generators/arduino/playground_master/ledmatrix.js',
  'generators/arduino/playground_master/oled.js',
  'generators/arduino/playground_master/menu.js',
  'generators/arduino/playground_master/relais.js',
  'generators/arduino/playground_master/dc_motor.js',
  'generators/arduino/playground_master/dht11.js',
  'generators/arduino/playground_master/ultrasonic.js',
  'generators/arduino/playground_master/sdcard.js',
  'generators/arduino/playground_master/max98357a.js',
  'generators/arduino/playground_master/brightness.js',
  'generators/arduino/playground_master/ws2812.js',
  'generators/arduino/playground_master/ble_remote.js',
  'generators/arduino/playground_master/ble_client.js',
  'generators/arduino/playground_master/test_all.js',
  'generators/arduino/playground_master/timer.js',
  'generators/arduino/playground_master/ky023.js',
  'generators/arduino/playground_master/serial.js',
  'generators/arduino/playground_master/variable.js',
  'generators/arduino/playground_master/cast.js',
  'generators/arduino/playground_master/global_array.js',
  'generators/arduino/playground_master/custom_code.js'
];
var masterGeneratorsLoading = null;

// Board-specific block definition scripts
var PLAYGROUND_MASTER_BLOCK_SCRIPTS = [
  'blocks/playground_master/sg90.js',
  'blocks/playground_master/internal_led.js',
  'blocks/playground_master/button.js',
  'blocks/playground_master/ledmatrix.js',
  'blocks/playground_master/oled.js',
  'blocks/playground_master/menu.js',
  'blocks/playground_master/relais.js',
  'blocks/playground_master/dc_motor.js',
  'blocks/playground_master/dht11.js',
  'blocks/playground_master/ultrasonic.js',
  'blocks/playground_master/sdcard.js',
  'blocks/playground_master/max98357a.js',
  'blocks/playground_master/brightness.js',
  'blocks/playground_master/ws2812.js',
  'blocks/playground_master/ble_remote.js',
  'blocks/playground_master/ble_client.js',
  'blocks/playground_master/test_all.js',
  'blocks/playground_master/timer.js',
  'blocks/playground_master/ky023.js',
  'blocks/playground_master/serial.js',
  'blocks/playground_master/variable.js',
  'blocks/playground_master/cast.js',
  'blocks/playground_master/global_array.js',
  'blocks/playground_master/custom_code.js'
];

var BRUMBRUM_BLOCK_SCRIPTS = [
  'blocks/playground_brumbrum/sg90.js',
  'blocks/playground_brumbrum/internal_led.js',
  'blocks/playground_brumbrum/button.js',
  'blocks/playground_brumbrum/dc_motor.js',
  'blocks/playground_brumbrum/ultrasonic.js',
  'blocks/playground_brumbrum/sdcard.js',
  'blocks/playground_brumbrum/max98357a.js',
  'blocks/playground_brumbrum/brightness.js',
  'blocks/playground_brumbrum/ws2812.js',
  'blocks/playground_brumbrum/ble_remote.js',
  'blocks/playground_master/cast.js',
  'blocks/playground_brumbrum/test_all.js',
  'blocks/playground_brumbrum/timer.js',
  'blocks/playground_brumbrum/ky023.js',
  'blocks/playground_brumbrum/serial.js',
  'blocks/playground_brumbrum/variable.js',
  'blocks/playground_brumbrum/global_array.js',
  'blocks/playground_brumbrum/custom_code.js'
];

var PLAYGROUND_CONTROLLER_BLOCK_SCRIPTS = [
  'blocks/playground_controller/internal_led.js',
  'blocks/playground_controller/oled.js',
  'blocks/playground_controller/haptic.js',
  'blocks/playground_controller/ky023.js',
  'blocks/playground_controller/menu.js',
  'blocks/playground_controller/sg90.js',
  'blocks/playground_controller/button.js',
  'blocks/playground_controller/dc_motor.js',
  'blocks/playground_controller/ultrasonic.js',
  'blocks/playground_controller/sdcard.js',
  'blocks/playground_controller/max98357a.js',
  'blocks/playground_controller/brightness.js',
  'blocks/playground_controller/ws2812.js',
  'blocks/playground_controller/ble_remote.js',
  'blocks/playground_controller/ble_client.js',
  'blocks/playground_master/cast.js',
  'blocks/playground_controller/test_all.js',
  'blocks/playground_controller/timer.js',
  'blocks/playground_controller/serial.js',
  'blocks/playground_controller/variable.js',
  'blocks/playground_controller/global_array.js',
  'blocks/playground_controller/custom_code.js'
];

var ARDUINO_UNO_BLOCK_SCRIPTS = [
  'blocks/arduino-uno/button.js'
];

var loadedBlockScripts = {};

var BOARD_INFO = {
  'playground_master': {
    name: 'BWS Playground Master',
    image: 'media/playground.png'
  },
  'playground_brumbrum': {
    name: 'Playground BrumBrum',
    image: 'media/brumbrum.png'
  },
  'playground_controller': {
    name: 'Playground Controller',
    image: 'media/esp32-controller.jpg'
  },
  'arduino-uno': {
    name: 'Arduino Uno',
    image: 'media/uno.jpg'
  }
};

var PIN_DATA_FILES = {
  'playground_master': 'generators/arduino/playground_master/pins_playground_master.js',
  'playground_brumbrum': 'generators/arduino/playground_brumbrum/pins_playground_brumbrum.js',
  'playground_controller': 'generators/arduino/playground_controller/pins_playground_controller.js',
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
      if (boardId === 'playground_master') {
        pinData = window.PIN_DATA_PLAYGROUND_MASTER;
      } else if (boardId === 'playground_brumbrum') {
        pinData = window.PIN_DATA_PLAYGROUND_BRUMBRUM;
      } else if (boardId === 'playground_controller') {
        pinData = window.PIN_DATA_PLAYGROUND_CONTROLLER;
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
    updateProfileFromPinData(currentPinData);
  }
}

function updateProfileFromPinData(pinData) {
  if (!pinData || !pinData.pins || typeof profile === 'undefined') return;
  
  var digitalPins = [];
  var analogPins = [];
  
  Object.keys(pinData.pins).forEach(function(pinKey) {
    var pin = pinData.pins[pinKey];
    var label = pin.name;
    if (pin.special && pin.special.length > 0) {
      label += ' - ' + pin.special.join(', ');
    }
    
    if (pin.capabilities) {
      if (pin.capabilities.includes('digital')) {
        digitalPins.push([label, pinKey]);
      }
      if (pin.capabilities.includes('adc') || pin.capabilities.includes('adc1') || pin.capabilities.includes('adc2') || pin.capabilities.includes('analog')) {
        analogPins.push([label, pinKey]);
      }
    }
  });
  
  if (!profile['default']) {
    profile['default'] = {};
  }
  
  profile['default'].digital = digitalPins;
  profile['default'].analog = analogPins.length > 0 ? analogPins : digitalPins;
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
  renderContent();
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

function ensurePlaygroundControllerGeneratorsLoaded() {
  if (playgroundControllerGeneratorsLoading) {
    return playgroundControllerGeneratorsLoading;
  }
  
  playgroundControllerGeneratorsLoading = loadScriptsSequential(PLAYGROUND_CONTROLLER_GENERATOR_SCRIPTS).then(function() {
    captureGeneratorSet('playgroundcontroller');
  }).catch(function(error) {
    console.error('Failed to load Playground Controller generator scripts', error);
  }).finally(function() {
    playgroundControllerGeneratorsLoading = null;
  });
  
  return playgroundControllerGeneratorsLoading;
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

function ensureMasterGeneratorsLoaded() {
  if (masterGeneratorsLoading) {
    return masterGeneratorsLoading;
  }

  // Remove existing master set so it gets re-captured with full generators
  delete GENERATOR_SETS.master;

  masterGeneratorsLoading = loadScriptsSequential(PLAYGROUND_MASTER_GENERATOR_SCRIPTS).then(function() {
    captureGeneratorSet('master');
  }).catch(function(error) {
    console.error('Failed to load Playground Master generator scripts', error);
  }).finally(function() {
    masterGeneratorsLoading = null;
  });

  return masterGeneratorsLoading;
}

function updateGeneratorsForBoard(boardId) {
  ensureMasterGeneratorSetCaptured();
  GENERATOR_SET_TARGET = boardId;
  if (boardId === 'playground_brumbrum') {
    ensureBrumbrumGeneratorsLoaded().then(function() {
      if (GENERATOR_SET_TARGET === 'playground_brumbrum') {
        applyGeneratorSet('brumbrum');
      }
    });
  } else if (boardId === 'playground_controller') {
    ensurePlaygroundControllerGeneratorsLoaded().then(function() {
      if (GENERATOR_SET_TARGET === 'playground_controller') {
        applyGeneratorSet('playgroundcontroller');
      }
    });
  } else if (boardId === 'arduino-uno') {
    ensureArduinoUnoGeneratorsLoaded().then(function() {
      if (GENERATOR_SET_TARGET === 'arduino-uno') {
        applyGeneratorSet('arduinouno');
      }
    });
  } else {
    ensureMasterGeneratorsLoaded().then(function() {
      if (GENERATOR_SET_TARGET === boardId) {
        applyGeneratorSet('master');
      }
    });
  }
}

/**
 * Load block definition scripts for a specific board.
 * This dynamically loads only the block definitions needed for the selected board.
 */
var currentBlockLoadingPromise = null;

function getBlockScriptsForBoard(boardId) {
  switch (boardId) {
    case 'playground_brumbrum':
      return BRUMBRUM_BLOCK_SCRIPTS;
    case 'playground_controller':
      return PLAYGROUND_CONTROLLER_BLOCK_SCRIPTS;
    case 'arduino-uno':
      return ARDUINO_UNO_BLOCK_SCRIPTS;
    case 'playground_master':
    default:
      return PLAYGROUND_MASTER_BLOCK_SCRIPTS;
  }
}

function loadBlocksForBoard(boardId) {
  var scripts = getBlockScriptsForBoard(boardId);
  
  // Filter out already loaded scripts
  var scriptsToLoad = scripts.filter(function(path) {
    return !loadedBlockScripts[path];
  });
  
  if (scriptsToLoad.length === 0) {
    return Promise.resolve();
  }
  
  return loadScriptsSequential(scriptsToLoad).then(function() {
    scriptsToLoad.forEach(function(path) {
      loadedBlockScripts[path] = true;
    });
  });
}

function updateBlocksForBoard(boardId) {
  return loadBlocksForBoard(boardId);
}

/**
 * Handle board selector dropdown change.
 * Called when user selects a different board from the dropdown.
 * Reloads the page to ensure a clean state with the new board.
 */
function onBoardSelectorChange(boardId) {
  showConfirmModal(i18n.t('messages.switchBoardConfirm') || 'Switching boards will clear your current workspace. Any unsaved changes will be lost. Continue?', function() {
    // Save current workspace to localStorage before reloading
    if (Blockly.mainWorkspace) {
      backup_blocks();
    }
    
    // Reload page with new board ID as URL parameter
    // This ensures a completely clean state
    window.location.href = window.location.pathname + '?board=' + encodeURIComponent(boardId);
  });
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
  // If Blockly is not initialized yet (initial selection from modal), reload page
  // This ensures a completely clean state with no script conflicts
  if (!Blockly.mainWorkspace) {
    // Clear localStorage and sessionStorage before reloading to ensure clean state
    if ('localStorage' in window) {
      delete window.localStorage.arduino;
    }
    // Clear sessionStorage to reset block info warnings for fresh project
    try {
      if (typeof seenBlocks !== 'undefined') seenBlocks.reset();
      if (typeof seenPinWarnings !== 'undefined') seenPinWarnings.reset();
    } catch (e) {}
    window.location.href = window.location.pathname + '?board=' + encodeURIComponent(boardId);
    return;
  }
  
  // Clear all blocks from workspace when changing boards
  if (Blockly.mainWorkspace) {
    Blockly.mainWorkspace.clear();
  }
  
  // Clear localStorage to prevent restoring incompatible blocks
  if ('localStorage' in window) {
    delete window.localStorage.arduino;
  }
  
  // Clear sessionStorage to reset block info warnings for new board
  try {
    if (typeof seenBlocks !== 'undefined') seenBlocks.reset();
    if (typeof seenPinWarnings !== 'undefined') seenPinWarnings.reset();
  } catch (e) {}
  
  // Otherwise, proceed with dynamic loading (used during initBoardSelection)
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
  
  if (boardId === 'playground_master' || boardId === 'playground_brumbrum' || boardId === 'playground_controller') {
    profile['default'] = profile['esp32'];
  } else if (boardId === 'arduino-uno') {
    profile['default'] = profile['arduino'];
  }
  
  // Load block definitions first, then update toolbox and generators
  updateBlocksForBoard(boardId).then(function() {
    updateToolboxForBoard(boardId);
    updateGeneratorsForBoard(boardId);
  }).catch(function(error) {
    console.error('Failed to load block scripts for board:', boardId, error);
    // Still try to update toolbox and generators even if block loading fails
    updateToolboxForBoard(boardId);
    updateGeneratorsForBoard(boardId);
  });
  
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
    var isMatch = false;
    if (requiredBoard) {
      var boards = requiredBoard.split(',').map(function(b) { return b.trim(); });
      isMatch = boards.indexOf(boardId) !== -1;
    }
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
  var boardSelector = document.getElementById('boardSelector');
  
  // Check for board parameter in URL (from board switch)
  var urlParams = new URLSearchParams(window.location.search);
  var boardFromUrl = urlParams.get('board');
  
  // Validate URL board parameter
  if (boardFromUrl && BOARD_INFO[boardFromUrl]) {
    // Check if we have saved data
    if ('localStorage' in window && window.localStorage.arduino) {
      try {
        var savedXml = Blockly.Xml.textToDom(window.localStorage.arduino);
        var savedBoardId = savedXml.getAttribute ? savedXml.getAttribute('board') : null;
        
        // Always clear saved workspace when loading via URL (new project)
        // This ensures a clean slate even when selecting the same board
        delete window.localStorage.arduino;
        // Reset block info warning caches (both in-memory and sessionStorage)
        if (typeof seenBlocks !== 'undefined') seenBlocks.reset();
        if (typeof seenPinWarnings !== 'undefined') seenPinWarnings.reset();
      } catch (e) {
        // If parsing fails, clear corrupted data
        delete window.localStorage.arduino;
      }
    } else {
      // No localStorage but board in URL - still reset caches
      if (typeof seenBlocks !== 'undefined') seenBlocks.reset();
      if (typeof seenPinWarnings !== 'undefined') seenPinWarnings.reset();
    }
    
    // Use board from URL and save it
    selectedBoard = boardFromUrl;
    setSelectedBoard(boardFromUrl);
    
    // Clean up URL (remove board parameter) but keep the clean state
    if (window.history.replaceState) {
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    if (boardSelector) {
      boardSelector.value = boardFromUrl;
      boardSelector.style.display = 'none';
    }
    updateBoardInfoDisplay(boardFromUrl);
    
    // Load pin data for the board
    loadPinDataFile(boardFromUrl).then(function(pinData) {
      setCurrentPinData(boardFromUrl);
    }).catch(function(error) {
      console.warn('Could not load pin data for board:', error);
    });
    
    if (boardFromUrl === 'playground_master' || boardFromUrl === 'playground_brumbrum' || boardFromUrl === 'playground_controller') {
      profile['default'] = profile['esp32'];
    } else if (boardFromUrl === 'arduino-uno') {
      profile['default'] = profile['arduino'];
    }
    
    // Load block scripts for the board, then update toolbox and generators
    window.setTimeout(function() {
      updateBlocksForBoard(boardFromUrl).then(function() {
        updateToolboxForBoard(boardFromUrl);
        updateGeneratorsForBoard(boardFromUrl);
      }).catch(function(error) {
        console.error('Failed to load initial block scripts:', error);
        updateToolboxForBoard(boardFromUrl);
        updateGeneratorsForBoard(boardFromUrl);
      });
    }, 100);
    return;
  }
  
  // Fall back to saved board from localStorage
  var savedBoard = getSelectedBoard();
  
  if (savedBoard) {
    selectedBoard = savedBoard;
    if (boardSelector) {
      boardSelector.value = savedBoard;
      boardSelector.style.display = 'none';
    }
    updateBoardInfoDisplay(savedBoard);
    // Reset warning caches when loading saved board
    if (typeof seenBlocks !== 'undefined') seenBlocks.reset();
    if (typeof seenPinWarnings !== 'undefined') seenPinWarnings.reset();
    
    // Load pin data for saved board
    loadPinDataFile(savedBoard).then(function(pinData) {
      setCurrentPinData(savedBoard);
    }).catch(function(error) {
      console.warn('Could not load pin data for saved board:', error);
    });
    
    if (savedBoard === 'playground_master' || savedBoard === 'playground_brumbrum' || savedBoard === 'playground_controller') {
      profile['default'] = profile['esp32'];
    } else if (savedBoard === 'arduino-uno') {
      profile['default'] = profile['arduino'];
    }
    
    // Load block scripts for saved board, then update toolbox and generators
    window.setTimeout(function() {
      updateBlocksForBoard(savedBoard).then(function() {
        updateToolboxForBoard(savedBoard);
        updateGeneratorsForBoard(savedBoard);
      }).catch(function(error) {
        console.error('Failed to load initial block scripts:', error);
        updateToolboxForBoard(savedBoard);
        updateGeneratorsForBoard(savedBoard);
      });
    }, 100);
  } else {
    if (boardSelector) {
      boardSelector.style.display = 'none';
    }
    // No board selected - clear warning caches for fresh state
    if (typeof seenBlocks !== 'undefined') seenBlocks.reset();
    if (typeof seenPinWarnings !== 'undefined') seenPinWarnings.reset();
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
  // Check if this is a "New Project" load (has board in URL)
  // If so, don't restore old workspace - start fresh
  var urlParams = new URLSearchParams(window.location.search);
  var boardFromUrl = urlParams.get('board');
  if (boardFromUrl && BOARD_INFO[boardFromUrl]) {
    // Clear localStorage to ensure fresh start
    delete window.localStorage.arduino;
    return;
  }
  
  if ('localStorage' in window && window.localStorage.arduino) {
    var xml = Blockly.Xml.textToDom(window.localStorage.arduino);
    
    // Check if saved board matches current board
    var savedBoardId = xml.getAttribute ? xml.getAttribute('board') : null;
    var currentBoardId = getActiveBoardId();
    
    // Only restore if boards match, or if no specific board is currently selected
    if (savedBoardId && currentBoardId && savedBoardId !== currentBoardId) {
      // Clear localStorage to prevent incompatible blocks
      delete window.localStorage.arduino;
      return;
    }
    
    applyBoardSelectionFromXml(xml);
    try {
      Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
    } catch (e) {
      // Block definitions may not be loaded yet; clear stale data
      console.warn('Could not restore blocks from localStorage:', e);
      delete window.localStorage.arduino;
      Blockly.mainWorkspace.clear();
    }
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
    boardId = (boardSelector && boardSelector.value) ? boardSelector.value : 'playground_master';
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
  if (arduinoCode.includes('initializeServo') || arduinoCode.includes('setServoAngle') || arduinoCode.includes('readServoAngle') || arduinoCode.includes('testServoSweep')) {
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
  renderContent();
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
  // Clear saved workspace data for "New Project"
  if ('localStorage' in window && window.localStorage.arduino) {
    delete window.localStorage.arduino;
  }
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
              // Delay to allow any other modals to close first
              window.setTimeout(function() {
                showBlockInfoModal(title, message);
              }, 100);
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
