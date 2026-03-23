i18n.registerTranslations('en', {
  "dateFormat": "%m/%d/%Y",
  "app": {
    "title": "BlocklyDuino",
    "subtitle": "Visual Programming for Arduino"
  },
  "tabs": {
    "blocks": "Blocks",
    "arduino": "Arduino",
    "xml": "XML"
  },
  "toolbar": {
    "download": "Download",
    "discard": "Discard changes",
    "save": "Save",
    "load": "Load",
    "boardSelector": "Select Board"
  },
  "modals": {
    "confirm": "Confirm",
    "cancel": "Cancel",
    "ok": "OK",
    "continue": "Continue",
    "info": "Info",
    "inputRequired": "Input Required",
    "missingDependency": "Missing Dependency",
    "warnings": "Warnings"
  },
  "messages": {
    "replaceBlocks": "Replace existing blocks?\n\"Cancel\" will merge.",
    "deleteAllBlocks": "Delete all {count} blocks?",
    "errorParsingXML": "Error parsing XML:\n{error}",
    "abandonChanges": "Abandon changes?",
    "serverError": "Server error",
    "notCompatible": "Not compatible with XMLHttpRequest",
    "programError": "Program error:\n{error}",
    "downloadSummary": "The following includes will be added to main.cpp:\n\n{includes}\nContinue with download?",
    "dependencyWarning": "The following dependencies are missing:\n\n{dependencies}\nYour code may not work correctly. Continue anyway?",
    "projectName": "What would you like to name your project?",
    "fileName": "What would you like to name your file?"
  },
  "categories": {
    "logic": "Logic",
    "constants": "Constants",
    "loops": "Loops",
    "timed": "Timed",
    "math": "Math",
    "text": "Text",
    "variables": "Variables",
    "functions": "Functions",
    "inputOutput": "Input/Output",
    "playground": "Playground",
    "sg90Servo": "SG90 Servo",
    "internalLED": "Internal LED",
    "button": "Button",
    "ledMatrix": "LED Matrix",
    "oled": "OLED Display",
    "relais": "Relais",
    "dcMotor": "DC Motor",
    "dht11": "DHT11",
    "ultrasonic": "Ultrasonic",
    "sdcard": "SD Card"
  },
  "blocks": {
    "servoInit": "Initialize",
    "servoMove": "Move",
    "servoRead": "Read Degrees",
    "servoTestSweep": "Test Sweep",
    "ledInit": "Initialize",
    "ledSet": "Set Color",
    "ledOff": "Turn Off",
    "ledTest": "Test RGB",
    "buttonInit": "Initialize",
    "buttonRead": "Read",
    "oledInit": "Initialize",
    "oledWrite": "Write",
    "oledClear": "Clear",
    "oledTest": "Test",
    "ledMatrixInit": "Initialize",
    "ledMatrixTest": "Test Rainbow",
    "relaisSet": "Set State",
    "relaisTest": "Test",
    "dcMotorInit": "Initialize",
    "dcMotorSet": "Set Direction",
    "dcMotorStop": "Stop",
    "dcMotorTest": "Test",
    "dht11Init": "Initialize",
    "dht11ReadTemp": "Read Temperature",
    "dht11ReadHumidity": "Read Humidity",
    "dht11Test": "Test",
    "ultrasonicRead": "Read Distance",
    "ultrasonicTest": "Test",
    "sdcardInit": "Initialize",
    "sdcardWrite": "Write to File",
    "sdcardRead": "Read from File",
    "sdcardAppend": "Append to File",
    "sdcardExists": "File Exists",
    "sdcardDelete": "Delete File",
    "sdcardTest": "Test"
  },
  "blockInfo": {
    "internalLED": {
      "title": "Internal RGB LED",
      "message": "Be careful. On the DEV-Board there is a solderable jumper that needs to be connected to make the internal RGB-LED work.",
      "testMessage": "This block tests the internal RGB LED: Red, Green, Blue (500ms each), then turns off."
    },
    "servo": {
      "title": "SG90 Servo",
      "message": "The servos only work with an external power-source of 5 to 6 volts.",
      "initMessage": "This block initializes all 3 SG90 servos.\n\nPins used:\n• Servo1: GPIO37\n• Servo2: GPIO38\n• Servo3: GPIO45",
      "moveMessage": "This block moves a servo to a specific angle (0-180 degrees).",
      "readMessage": "This block reads the current angle of a servo.",
      "testMessage": "This block performs a full 180° sweep back and forward once."
    },
    "button": {
      "title": "Button",
      "initMessage": "This block initializes all 4 buttons.\n\nPins used:\n• Button1: GPIO4\n• Button2: GPIO5\n• Button3: GPIO6\n• Button4: GPIO7",
      "readMessage": "This block reads the state of a button.\n\nReturns true when pressed, false when not pressed."
    },
    "oled": {
      "title": "OLED Display",
      "testMessage": "This block tests the OLED display by showing 'OLED Test' on the screen."
    },
    "ledMatrix": {
      "title": "LED Matrix",
      "message": "The LED Matrix only works with an external power-source of 5 volts.",
      "testMessage": "This block tests the LED Matrix with a rainbow effect, cycling through all 16 LEDs."
    },
    "relais": {
      "title": "Relais",
      "message": "Relais need an external powersource of 5V to work.",
      "testMessage": "This block tests both relays by turning them on and off with a 500ms delay, 5 times each."
    },
    "dcMotor": {
      "title": "DC Motor",
      "message": "Motors need an external powersource. Make sure the jumper is set correctly.",
      "testMessage": "This block tests both motors: forward, stop, backward, stop (1 second each), 3 times."
    },
    "dht11": {
      "title": "DHT11 Sensor",
      "message": "The DHT11 sensor measures temperature (0-50°C) and humidity (20-90%). Read interval should be at least 2 seconds.",
      "testMessage": "This block tests the DHT11 sensor by reading temperature and humidity values and displaying them on the OLED display for 20 seconds."
    },
    "ultrasonic": {
      "title": "Ultrasonic Sensor",
      "message": "The ultrasonic sensor needs an external power source of 5V to work correctly.",
      "testMessage": "This block tests the ultrasonic sensor by reading distance values and displaying them on the OLED display for 10 seconds."
    },
    "sdcard": {
      "title": "SD Card Module",
      "message": "",
      "testMessage": "This block tests the SD card by writing, reading, and deleting a test file."
    }
  },
  "dependencies": {
    "buttonRead": "Buttons must be initialized before they can be read.",
    "servoMove": "Servos must be initialized before they can be moved.",
    "servoRead": "Servos must be initialized before they can be read.",
    "servoTestSweep": "Servos must be initialized before running test sweep.",
    "ledSet": "Internal LED must be initialized before setting color.",
    "ledOff": "Internal LED must be initialized before turning off.",
    "ledTest": "Internal LED must be initialized before running test.",
    "ledMatrixSetPixel": "LED Matrix must be initialized before setting pixels.",
    "ledMatrixFill": "LED Matrix must be initialized before filling.",
    "ledMatrixShow": "LED Matrix must be initialized before showing.",
    "ledMatrixOff": "LED Matrix must be initialized before turning off.",
    "ledMatrixTest": "LED Matrix must be initialized before running test.",
    "oledWrite": "OLED must be initialized before writing.",
    "oledClear": "OLED must be initialized before clearing.",
    "oledTest": "OLED must be initialized before running test.",
    "dcMotorSet": "DC Motors must be initialized before setting direction.",
    "dcMotorStop": "DC Motors must be initialized before stopping.",
    "dcMotorTest": "DC Motors must be initialized before running test.",
    "dht11ReadTemp": "DHT11 must be initialized before reading temperature.",
    "dht11ReadHumidity": "DHT11 must be initialized before reading humidity.",
    "dht11Test": "DHT11 must be initialized before running test.",
    "sdcardWrite": "SD Card must be initialized before writing.",
    "sdcardRead": "SD Card must be initialized before reading.",
    "sdcardAppend": "SD Card must be initialized before appending.",
    "sdcardExists": "SD Card must be initialized before checking file existence.",
    "sdcardDelete": "SD Card must be initialized before deleting files.",
    "sdcardTest": "SD Card must be initialized before running test."
  }
});
