/**
 * Execute the user's code.
 * Just a quick and dirty eval.  No checks for infinite loops, etc.
 */
function runJS() {
  var code = Blockly.Generator.workspaceToCode('JavaScript');
  try {
    eval(code);
  } catch (e) {
    alert('Program error:\n' + e);
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
  var fileName = window.prompt('What would you like to name your file?', 'BlocklyDuino')
  //doesn't save if the user quits the save prompt
  if(fileName){
    var blob = new Blob([Blockly.Arduino.workspaceToCode()], {type: 'text/plain;charset=utf-8'});
    saveAs(blob, fileName + '.ino');
  }
}

/**
* Save complete PlatformIO project as ZIP.
*/
async function saveProject() {
  var fileName = window.prompt('What would you like to name your project?', 'MyProject');
  if (!fileName) {
    return;
  }

  var boardId = document.getElementById('boardSelector').value;
  var arduinoCode = Blockly.Arduino.workspaceToCode();

  var zip = new JSZip();

  // Fetch template files from server
  try {
    var response = await fetch('/template/' + boardId);
    if (response.ok) {
      var templateFiles = await response.json();
      
      // Add all template files to ZIP
      for (var filepath in templateFiles) {
        // Replace main.cpp with generated code
        if (filepath === 'src/main.cpp') {
          // Keep the includes from template but replace the rest
          var templateMain = templateFiles[filepath];
          var includeSection = templateMain.match(/#include[^\n]+\n/g);
          var newMain = '#include <Arduino.h>\n';
          if (includeSection) {
            newMain = includeSection.join('') + '\n';
          }
          newMain += arduinoCode;
          zip.file(filepath, newMain);
        } else {
          zip.file(filepath, templateFiles[filepath]);
        }
      }
    } else {
      // Fallback to simple project structure if template not found
      throw new Error('Template not found');
    }
  } catch (e) {
    // Fallback for Arduino Uno or if template fetch fails
    var mainCpp = '#include <Arduino.h>\n\n' + arduinoCode;
    zip.file('src/main.cpp', mainCpp);

    var platformioContent = '';
    if (boardId === 'arduino-uno') {
      platformioContent = `; PlatformIO Project Configuration File
; https://docs.platformio.org/page/projectconf.html

[env:uno]
platform = atmelavr
board = uno
framework = arduino
monitor_speed = 9600
lib_deps = 
    arduino-libraries/Servo@^1.1.8
`;
    } else {
      platformioContent = `; PlatformIO Project Configuration File
; https://docs.platformio.org/page/projectconf.html

[env:esp32-s3-devkitc-1]
platform = espressif32
board = esp32-s3-devkitc-1
framework = arduino
monitor_speed = 115200
lib_deps = 
    arduino-libraries/Servo@^1.1.8
`;
    }
    zip.file('platformio.ini', platformioContent);

    zip.file('.vscode/settings.json', JSON.stringify({
      "editor.tabSize": 2,
      "files.associations": {
        "*.ino": "cpp"
      }
    }, null, 2));

    zip.file('.gitignore', `.pio
.vscode/.browse.c_cpp.db*
.vscode/c_cpp_properties.json
.vscode/launch.json
.vscode/ipch
`);
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
  var fileName = window.prompt('What would you like to name your file?', 'BlocklyDuino');
  // Store data in blob.
  // var builder = new BlobBuilder();
  // builder.append(data);
  // saveAs(builder.getBlob('text/plain;charset=utf-8'), 'blockduino.xml');
  if(fileName){
    var blob = new Blob([data], {type: 'text/xml'});
    saveAs(blob, fileName + ".xml");
  } 
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
        alert('Error parsing XML:\n' + e);
        return;
      }
      var count = Blockly.mainWorkspace.getAllBlocks().length;
      if (count && confirm('Replace existing blocks?\n"Cancel" will merge.')) {
        Blockly.mainWorkspace.clear();
      }
      Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
    }
    // Reset value of input after loading because Chrome will not fire
    // a 'change' event if the same file is loaded again.
    document.getElementById('load').value = '';
  };
  reader.readAsText(files[0]);
}

/**
 * Discard all blocks from the workspace.
 */
function discard() {
  var count = Blockly.mainWorkspace.getAllBlocks().length;
  if (count < 2 || window.confirm('Delete all ' + count + ' blocks?')) {
    Blockly.mainWorkspace.clear();
    // Recreate setup and loop blocks
    window.setTimeout(ensureProgramStructure, 50);
    renderContent();
  }
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
    setupBlock.moveBy(20, 20);
  }

  // Create loop block if missing - positioned horizontally next to setup
  if (!hasLoop) {
    var loopBlock = Blockly.Block.obtain(Blockly.mainWorkspace, 'arduino_loop');
    loopBlock.initSvg();
    loopBlock.render();
    loopBlock.moveBy(250, 20);
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
        alert('Error parsing XML:\n' + e);
        return;
      }
      var count = Blockly.mainWorkspace.getAllBlocks().length;
      if (count && confirm('Replace existing blocks?\n"Cancel" will merge.')) {
        Blockly.mainWorkspace.clear();
      }
      Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
    } else {
      alert("Server error");
    }
  }
}

function load_by_url(uri) {
  ajax = createAJAX();
  if (!ajax) {
　　   alert ('Not compatible with XMLHttpRequest');
　　   return 0;
　  }
  if (ajax.overrideMimeType) {
    ajax.overrideMimeType('text/xml');
  }

　　ajax.onreadystatechange = onSuccess;
　　ajax.open ("GET", uri, true);
　　ajax.send ("");
}

function uploadCode(code, callback) {
    var target = document.getElementById('content_arduino');
    var spinner = new Spinner().spin(target);

    var url = "http://127.0.0.1:8080/";
    var method = "POST";

    // You REALLY want async = true.
    // Otherwise, it'll block ALL execution waiting for server response.
    var async = true;

    var request = new XMLHttpRequest();
    
    request.onreadystatechange = function() {
        if (request.readyState != 4) { 
            return; 
        }
        
        spinner.stop();
        
        var status = parseInt(request.status); // HTTP response status, e.g., 200 for "200 OK"
        var errorInfo = null;
        switch (status) {
        case 200:
            break;
        case 0:
            errorInfo = "code 0\n\nCould not connect to server at " + url + ".  Is the local web server running?";
            break;
        case 400:
            errorInfo = "code 400\n\nBuild failed - probably due to invalid source code.  Make sure that there are no missing connections in the blocks.";
            break;
        case 500:
            errorInfo = "code 500\n\nUpload failed.  Is the Arduino connected to USB port?";
            break;
        case 501:
            errorInfo = "code 501\n\nUpload failed.  Is 'ino' installed and in your path?  This only works on Mac OS X and Linux at this time.";
            break;
        default:
            errorInfo = "code " + status + "\n\nUnknown error.";
            break;
        };
        
        callback(status, errorInfo);
    };

    request.open(method, url, async);
    request.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
    request.send(code);	     
}

function uploadClick() {
    var code = Blockly.Arduino.workspaceToCode();

    alert("Ready to upload to Arduino.");
    
    uploadCode(code, function(status, errorInfo) {
        if (status == 200) {
            alert("Program uploaded ok");
        } else {
            alert("Error uploading program: " + errorInfo);
        }
    });
}

function resetClick() {
    var code = "void setup() {} void loop() {}";

    uploadCode(code, function(status, errorInfo) {
        if (status != 200) {
            alert("Error resetting program: " + errorInfo);
        }
    });
}
