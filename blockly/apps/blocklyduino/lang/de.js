i18n.registerTranslations('de', {
  "app": {
    "title": "BlocklyDuino",
    "subtitle": "Visuelle Programmierung für Arduino"
  },
  "tabs": {
    "blocks": "Blöcke",
    "arduino": "Arduino",
    "xml": "XML"
  },
  "toolbar": {
    "download": "Herunterladen",
    "discard": "Verwerfen",
    "save": "Speichern",
    "load": "Laden",
    "boardSelector": "Board auswählen"
  },
  "modals": {
    "confirm": "Bestätigen",
    "cancel": "Abbrechen",
    "ok": "OK",
    "continue": "Fortfahren",
    "info": "Info",
    "inputRequired": "Eingabe erforderlich",
    "missingDependency": "Fehlende Abhängigkeit"
  },
  "messages": {
    "replaceBlocks": "Bestehende Blöcke ersetzen?\n\"Abbrechen\" führt sie zusammen.",
    "deleteAllBlocks": "Alle {count} Blöcke löschen?",
    "errorParsingXML": "Fehler beim Parsen von XML:\n{error}",
    "abandonChanges": "Änderungen verwerfen?",
    "serverError": "Serverfehler",
    "notCompatible": "Nicht kompatibel mit XMLHttpRequest",
    "programError": "Programmfehler:\n{error}",
    "downloadSummary": "Die folgenden Includes werden zu main.cpp hinzugefügt:\n\n{includes}\nMit Download fortfahren?",
    "dependencyWarning": "Die folgenden Abhängigkeiten fehlen:\n\n{dependencies}\nIhr Code funktioniert möglicherweise nicht korrekt. Trotzdem fortfahren?",
    "projectName": "Wie möchten Sie Ihr Projekt nennen?",
    "fileName": "Wie möchten Sie Ihre Datei nennen?"
  },
  "categories": {
    "logic": "Logik",
    "constants": "Konstanten",
    "loops": "Schleifen",
    "timed": "Zeit",
    "math": "Mathematik",
    "text": "Text",
    "variables": "Variablen",
    "functions": "Funktionen",
    "inputOutput": "Eingabe/Ausgabe",
    "playground": "Spielwiese",
    "sg90Servo": "SG90 Servo",
    "internalLED": "Interne LED",
    "button": "Taster"
  },
  "blocks": {
    "servoInit": "Initialisieren",
    "servoMove": "Bewegen",
    "servoRead": "Grad lesen",
    "ledInit": "Initialisieren",
    "ledSet": "Farbe setzen",
    "ledOff": "Ausschalten",
    "buttonInit": "Initialisieren",
    "buttonRead": "Lesen"
  },
  "blockInfo": {
    "internalLED": {
      "title": "Interne RGB-LED",
      "message": "Achtung. Auf dem DEV-Board gibt es eine lötbare Brücke, die verbunden werden muss, damit die interne RGB-LED funktioniert."
    },
    "servo": {
      "title": "SG90 Servo",
      "message": "Die Servos funktionieren nur mit einer externen Stromquelle von 5 bis 6 Volt.",
      "initMessage": "Dieser Block initialisiert alle 3 SG90 Servos.\n\nVerwendete Pins:\n• Servo1: GPIO37\n• Servo2: GPIO38\n• Servo3: GPIO45",
      "moveMessage": "Dieser Block bewegt einen Servo auf einen bestimmten Winkel (0-180 Grad).",
      "readMessage": "Dieser Block liest den aktuellen Winkel eines Servos."
    },
    "button": {
      "title": "Taster",
      "initMessage": "Dieser Block initialisiert alle 4 Taster.\n\nVerwendete Pins:\n• Taster1: GPIO4\n• Taster2: GPIO5\n• Taster3: GPIO6\n• Taster4: GPIO7",
      "readMessage": "Dieser Block liest den Status eines Tasters.\n\nGibt true zurück wenn gedrückt, false wenn nicht gedrückt."
    }
  },
  "dependencies": {
    "buttonRead": "Taster müssen initialisiert werden, bevor sie gelesen werden können.",
    "servoMove": "Servos müssen initialisiert werden, bevor sie bewegt werden können.",
    "servoRead": "Servos müssen initialisiert werden, bevor sie gelesen werden können.",
    "ledSet": "Die interne LED muss initialisiert werden, bevor die Farbe gesetzt werden kann.",
    "ledOff": "Die interne LED muss initialisiert werden, bevor sie ausgeschaltet werden kann."
  }
});
