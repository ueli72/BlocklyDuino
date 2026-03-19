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

/**
 * Backup code blocks to localStorage.
 */
function backup_blocks() {
  if ('localStorage' in window) {
    var xml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
    window.localStorage.setItem('arduino', Blockly.Xml.domToText(xml));
  }
}

/**
 * Restore code blocks from localStorage.
 */
function restore_blocks() {
  if ('localStorage' in window && window.localStorage.arduino) {
    var xml = Blockly.Xml.textToDom(window.localStorage.arduino);
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
  var boardId = document.getElementById('boardSelector').value;
  var arduinoCode = Blockly.Arduino.workspaceToCode(Blockly.mainWorkspace);

  var zip = new JSZip();

  // Get template from embedded templates
  var template = BOARD_TEMPLATES[boardId];
  
  if (template) {
    // Add all template files to ZIP
    for (var filepath in template) {
      zip.file(filepath, template[filepath]);
    }
  }

  // Always add src/main.cpp with generated code
  var newMain = '#include <Arduino.h>\n';
  // Add includes for servo and LED if used
  if (arduinoCode.includes('initializeServos') || arduinoCode.includes('setServoAngle') || arduinoCode.includes('readServoAngle')) {
    newMain += '#include "servos.h"\n';
  }
  if (arduinoCode.includes('initializeLED') || arduinoCode.includes('setLED') || arduinoCode.includes('turnOffLED')) {
    newMain += '#include "internalLED.h"\n';
  }
  if (arduinoCode.includes('initializeButtons') || arduinoCode.includes('readButton')) {
    newMain += '#include "buttons.h"\n';
  }
  if (arduinoCode.includes('initializeLEDMatrix') || arduinoCode.includes('setLEDMatrixPixel') || arduinoCode.includes('fillLEDMatrix') || arduinoCode.includes('showLEDMatrix') || arduinoCode.includes('turnOffLEDMatrix')) {
    newMain += '#include "LEDMatrix.h"\n';
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
  Blockly.mainWorkspace.clear();
  // Recreate setup and loop blocks
  window.setTimeout(ensureProgramStructure, 50);
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

  // Init board selector event
  var boardSelector = document.getElementById('boardSelector');
  if (boardSelector) {
    boardSelector.addEventListener('change', function() {
      var boardId = this.value;
      if (boardId === 'esp32-s3-devkitc1') {
        profile['default'] = profile['esp32'];
      } else if (boardId === 'arduino-uno') {
        profile['default'] = profile['arduino'];
      }
    });
    // Set initial profile based on default selection
    profile['default'] = profile['esp32'];
  }

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
        // Check for block info
        if (hasBlockInfo(block.type) && !seenBlocks.has(block.type)) {
          seenBlocks.add(block.type);
          var info = getBlockInfo(block.type);
          if (info) {
            var title = i18n.t(info.title);
            var message = i18n.t(info.message);
            showBlockInfoModal(title, message);
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
 * Ensure setup and loop blocks are present in the workspace.
 */
function ensureProgramStructure() {
  if (!Blockly.mainWorkspace) {
    return;
  }

  var blocks = Blockly.mainWorkspace.getAllBlocks();
  var hasSetup = false;
  var hasLoop = false;

  for (var i = 0; i < blocks.length; i++) {
    if (blocks[i].type === 'arduino_setup') {
      hasSetup = true;
    }
    if (blocks[i].type === 'arduino_loop') {
      hasLoop = true;
    }
  }

  // Create setup block if missing
  if (!hasSetup) {
    var setupBlock = Blockly.Block.obtain(Blockly.mainWorkspace, 'arduino_setup');
    setupBlock.initSvg();
    setupBlock.render();
    setupBlock.moveBy(50, 50);
  }

  // Create loop block if missing - positioned horizontally next to setup
  if (!hasLoop) {
    var loopBlock = Blockly.Block.obtain(Blockly.mainWorkspace, 'arduino_loop');
    loopBlock.initSvg();
    loopBlock.render();
    loopBlock.moveBy(350, 50);
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
