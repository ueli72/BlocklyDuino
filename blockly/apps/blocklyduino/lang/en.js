i18n.registerTranslations('en', {
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
    "missingDependency": "Missing Dependency"
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
    "ledMatrix": "LED Matrix"
  },
  "blocks": {
    "servoInit": "Initialize",
    "servoMove": "Move",
    "servoRead": "Read Degrees",
    "ledInit": "Initialize",
    "ledSet": "Set Color",
    "ledOff": "Turn Off",
    "buttonInit": "Initialize",
    "buttonRead": "Read"
  },
  "blockInfo": {
    "internalLED": {
      "title": "Internal RGB LED",
      "message": "Be careful. On the DEV-Board there is a solderable jumper that needs to be connected to make the internal RGB-LED work."
    },
    "servo": {
      "title": "SG90 Servo",
      "message": "The servos only work with an external power-source of 5 to 6 volts.",
      "initMessage": "This block initializes all 3 SG90 servos.\n\nPins used:\n• Servo1: GPIO37\n• Servo2: GPIO38\n• Servo3: GPIO45",
      "moveMessage": "This block moves a servo to a specific angle (0-180 degrees).",
      "readMessage": "This block reads the current angle of a servo."
    },
    "button": {
      "title": "Button",
      "initMessage": "This block initializes all 4 buttons.\n\nPins used:\n• Button1: GPIO4\n• Button2: GPIO5\n• Button3: GPIO6\n• Button4: GPIO7",
      "readMessage": "This block reads the state of a button.\n\nReturns true when pressed, false when not pressed."
    }
  },
  "dependencies": {
    "buttonRead": "Buttons must be initialized before they can be read.",
    "servoMove": "Servos must be initialized before they can be moved.",
    "servoRead": "Servos must be initialized before they can be read.",
    "ledSet": "Internal LED must be initialized before setting color.",
    "ledOff": "Internal LED must be initialized before turning off.",
    "ledMatrixSetPixel": "LED Matrix must be initialized before setting pixels.",
    "ledMatrixFill": "LED Matrix must be initialized before filling.",
    "ledMatrixShow": "LED Matrix must be initialized before showing.",
    "ledMatrixOff": "LED Matrix must be initialized before turning off."
  }
});
