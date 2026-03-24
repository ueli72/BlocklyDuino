i18n.registerTranslations('de', {
  "dateFormat": "%d.%m.%Y",
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
    "missingDependency": "Fehlende Abhängigkeit",
    "warnings": "Warnungen"
  },
  "boardSelection": {
    "title": "Board auswählen",
    "description": "Wählen Sie Ihr Board, um ein neues Projekt zu starten:",
    "playgroundDesc": "Spezialisiertes Entwicklungsboard von BWS Uster für Lernprojekte.",
    "unoDesc": "Klassisches Arduino-Board für einfache Projekte"
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
    "timed": "Zeit / Interrupts",
    "math": "Mathematik",
    "text": "Text",
    "variables": "Variablen",
    "functions": "Funktionen",
    "inputOutput": "Eingabe/Ausgabe",
    "playground": "Playground",
    "sg90Servo": "SG90 Servo",
    "internalLED": "Interne LED",
    "button": "Taster",
    "ledMatrix": "LED Matrix",
    "oled": "OLED Display",
    "relais": "Relais",
    "dcMotor": "DC Motor",
    "dht11": "DHT11",
    "ultrasonic": "Ultraschall",
    "sdcard": "SD Karte",
    "max98357a": "MAX98357A",
"brightness": "Helligkeit",
    "ws2812": "WS2812 LED Streifen",
    "bluetoothLE": "Bluetooth LE",
    "testAll": "Alle Testen"
  },
  "blocks": {
    "servoInit": "Initialisieren",
    "servoMove": "Bewegen",
    "servoRead": "Grad lesen",
    "servoTestSweep": "Test Durchlauf",
    "ledInit": "Initialisieren",
    "ledSet": "Farbe setzen",
    "ledOff": "Ausschalten",
    "ledTest": "RGB Test",
    "buttonInit": "Initialisieren",
    "buttonRead": "Lesen",
    "buttonInterrupt": "Bei Interrupt",
    "asyncTimer": "Nach",
    "oledInit": "Initialisieren",
    "oledWrite": "Schreiben",
    "oledClear": "Löschen",
    "oledTest": "Test",
    "ledMatrixInit": "Initialisieren",
    "ledMatrixTest": "Regenbogen Test",
    "relaisSet": "Status setzen",
    "relaisTest": "Test",
    "dcMotorInit": "Initialisieren",
    "dcMotorSet": "Richtung setzen",
    "dcMotorStop": "Stop",
    "dcMotorTest": "Test",
    "dht11Init": "Initialisieren",
    "dht11ReadTemp": "Temperatur lesen",
    "dht11ReadHumidity": "Feuchtigkeit lesen",
    "dht11Test": "Test",
    "ultrasonicRead": "Distanz lesen",
    "ultrasonicTest": "Test",
    "sdcardInit": "Initialisieren",
    "sdcardWrite": "In Datei schreiben",
    "sdcardRead": "Aus Datei lesen",
    "sdcardAppend": "An Datei anhängen",
    "sdcardExists": "Datei existiert",
    "sdcardDelete": "Datei löschen",
    "sdcardTest": "Test",
    "max98357aInit": "Initialisieren",
    "max98357aPlayTone": "Ton spielen",
    "max98357aStop": "Stop",
    "max98357aTest": "Test",
    "max98357aPlayFile": "Datei abspielen",
    "max98357aIsPlaying": "Spielt",
    "max98357aWaitUntilDone": "Warten bis fertig",
    "brightnessRead": "Helligkeit lesen",
    "ws2812Init": "Initialisieren",
    "ws2812SetPixel": "Pixel setzen",
    "ws2812Fill": "Alle füllen",
    "ws2812Show": "Anzeigen",
    "ws2812Off": "Ausschalten",
    "ws2812Test": "Test",
    "bleRemoteInit": "Initialisieren",
    "bleRemoteOnDirection": "Bei Richtung",
    "bleRemoteOnSpeed": "Bei Geschwindigkeit",
    "bleRemoteOnCommand": "Bei Befehl",
    "bleRemoteSend": "Daten senden",
    "bleRemoteIsConnected": "Verbunden",
    "bleRemoteTest": "Test",
    "testAll": "Alle Testen"
  },
  "blockInfo": {
    "internalLED": {
      "title": "Interne RGB-LED",
      "message": "Achtung. Auf dem DEV-Board gibt es eine lötbare Brücke, die verbunden werden muss, damit die interne RGB-LED funktioniert.",
      "testMessage": "Dieser Block testet die interne RGB-LED: Rot, Grün, Blau (je 500ms), dann aus."
    },
    "servo": {
      "title": "SG90 Servo",
      "message": "Die Servos funktionieren nur mit einer externen Stromquelle von 5 bis 6 Volt.",
      "initMessage": "Dieser Block initialisiert alle 3 SG90 Servos.\n\nVerwendete Pins:\n• Servo1: GPIO37\n• Servo2: GPIO38\n• Servo3: GPIO45",
      "moveMessage": "Dieser Block bewegt einen Servo auf einen bestimmten Winkel (0-180 Grad).",
      "readMessage": "Dieser Block liest den aktuellen Winkel eines Servos.",
      "testMessage": "Dieser Block führt einen vollen 180° Durchlauf vor und zurück aus."
    },
    "button": {
      "title": "Taster",
      "initMessage": "Dieser Block initialisiert alle 4 Taster.\n\nVerwendete Pins:\n• Taster1: GPIO1\n• Taster2: GPIO4\n• Taster3: GPIO3\n• Taster4: GPIO2",
      "readMessage": "Dieser Block liest den Status eines Tasters.\n\nGibt true zurück wenn gedrückt, false wenn nicht gedrückt.",
      "interruptMessage": "ISR Einschränkungen:\n• Kein delay() oder delayMicroseconds()\n• Kein Serial.print() oder Serial.write()\n• Code kurz und schnell halten\n• 'volatile' für Variablen verwenden, die mit der Hauptschleife geteilt werden\n• Funktionsaufrufe vermeiden, die blockieren könnten\n\nDer Interrupt läuft asynchron und nicht-blockierend."
    },
    "oled": {
      "title": "OLED Display",
      "testMessage": "Dieser Block testet das OLED Display indem 'OLED Test' auf dem Bildschirm angezeigt wird."
    },
    "ledMatrix": {
      "title": "LED Matrix",
      "message": "Die LED Matrix funktioniert nur mit einer externen Stromquelle von 5 Volt.",
      "testMessage": "Dieser Block testet die LED Matrix mit einem Regenbogen-Effekt, der alle 16 LEDs durchläuft."
    },
    "relais": {
      "title": "Relais",
      "message": "Relais benötigen eine externe Stromquelle von 5V.",
      "testMessage": "Dieser Block testet beide Relais, indem sie mit einer Verzögerung von 500ms 5-mal ein- und ausgeschaltet werden."
    },
    "dcMotor": {
      "title": "DC Motor",
      "message": "Motoren benötigen eine externe Stromquelle. Stellen Sie sicher, dass der Jumper korrekt gesetzt ist.",
      "testMessage": "Dieser Block testet beide Motoren: vorwärts, stop, rückwärts, stop (je 1 Sekunde), 3-mal."
    },
    "dht11": {
      "title": "DHT11 Sensor",
      "message": "Der DHT11 Sensor misst Temperatur (0-50°C) und Luftfeuchtigkeit (20-90%). Das Leseintervall sollte mindestens 2 Sekunden betragen.",
      "testMessage": "Dieser Block testet den DHT11 Sensor, indem Temperatur und Luftfeuchtigkeit gelesen und 20 Sekunden lang auf dem OLED Display angezeigt werden."
    },
    "ultrasonic": {
      "title": "Ultraschall Sensor",
      "message": "Der Ultraschall-Sensor benötigt eine externe Stromquelle von 5V.",
      "testMessage": "Dieser Block testet den Ultraschall-Sensor, indem Distanzwerte gelesen und 10 Sekunden lang auf dem OLED Display angezeigt werden."
    },
    "sdcard": {
      "title": "SD Karten Modul",
      "message": "",
      "testMessage": "Dieser Block testet die SD Karte, indem eine Testdatei geschrieben, gelesen und gelöscht wird."
    },
    "max98357a": {
      "title": "MAX98357A Verstärker",
      "message": "Der MAX98357A ist ein I2S-Audioverstärker. Er benötigt eine externe Stromquelle von 5V und einen angeschlossenen Lautsprecher.",
      "testWarning": "Platzieren Sie eine 'test.wav' Datei (16kHz, 8bit mono) auf der SD-Karte. Falls nicht vorhanden, wird ein Dreiklang gespielt.",
      "testMessage": "Dieser Block testet den MAX98357A Verstärker. Wenn eine 'test.wav' Datei (16kHz, 8bit mono) auf der SD-Karte existiert, wird sie abgespielt. Andernfalls wird ein Dreiklang (C4, E4, G4, C5) gespielt.",
      "playFileMessage": "WAV-Dateien müssen sein: 16kHz Abtastrate, 8-bit, mono. Andere Formate werden nicht korrekt abgespielt.",
      "isPlayingMessage": "Gibt true zurück, wenn Audio im Hintergrund abgespielt wird. Verwenden Sie dies, um zu prüfen, ob die Wiedergabe noch läuft.",
      "waitUntilDoneMessage": "Blockiert die Ausführung bis die Audiowiedergabe beendet ist. Audio läuft im Hintergrund, dieser Block wartet auf den Abschluss."
    },
    "testAll": {
      "title": "Alle Testen",
      "message": "Interaktives Testmenü für alle Komponenten. SW1/SW2 zum Navigieren, SW3 zum Auswählen, SW4 zum Beenden.",
      "testMessage": "Dieser Block zeigt ein interaktives Menü auf dem OLED Display an. Wählen Sie mit den Tastern, welche Komponente getestet werden soll."
    },
    "timer": {
      "title": "Async Timer",
      "message": "Nicht-blockierender Timer mit Ticker Bibliothek.\n\n• 'once': Führt Code einmal nach der Verzögerung aus\n• 'repeated': Führt Code in jedem Verzögerungsintervall aus\n\n⚠️ ISR Einschränkungen:\n• Kein delay() oder delayMicroseconds()\n• Kein Serial.print()\n• Kein OLED, SD Card, DHT11, Ultrasonic\n• Kein MAX98357A, Internal LED\n• 'volatile' für Variablen verwenden, die mit der Hauptschleife geteilt werden\n\nDer Timer läuft asynchron und nicht-blockierend."
    },
    "brightness": {
      "title": "Helligkeitssensor",
      "message": "GL5546 LDR mit 1MOhm Widerstand. Gibt Analogwert 0-4095 zurück. Höherer Wert = mehr Licht erkannt."
    },
    "ws2812": {
      "title": "WS2812 LED Streifen",
      "message": "Adressierbarer RGB-LED-Streifen mit Adafruit NeoPixel Bibliothek. Pixel-Farben setzen, dann Anzeigen aufrufen.",
      "testMessage": "Dieser Block testet den WS2812 Streifen, indem er 3-mal durch die Farben Rot, Grün, Blau wechselt."
    },
    "bleRemote": {
      "title": "BLE Fernsteuerung",
      "message": "Bluetooth Low Energy Server für mobile App Fernsteuerung. LightBlue App zum Testen verwenden.",
      "callbackMessage": "⚠️ ISR Einschränkungen: Kein delay(), kein Serial, kein OLED/SD Card/DHT11/Ultrasonic. Nur Motor/LED/Servo Steuerung erlaubt.",
      "sendMessage": "Sensordaten an verbundene mobile App senden. Nur im Hauptprogramm verwenden, nicht in BLE Callbacks.",
      "testMessage": "Testet BLE durch Ausgabe des Verbindungsstatus auf Serial. Mit LightBlue App verbinden zum Testen.",
      "testInfo": "Siehe readme_ble_deu.txt für detaillierte Testanleitung mit der LightBlue App."
    }
  },
  "dependencies": {
    "buttonRead": "Taster müssen initialisiert werden, bevor sie gelesen werden können.",
    "servoMove": "Servos müssen initialisiert werden, bevor sie bewegt werden können.",
    "servoRead": "Servos müssen initialisiert werden, bevor sie gelesen werden können.",
    "servoTestSweep": "Servos müssen initialisiert werden, bevor der Test durchgeführt werden kann.",
    "ledSet": "Die interne LED muss initialisiert werden, bevor die Farbe gesetzt werden kann.",
    "ledOff": "Die interne LED muss initialisiert werden, bevor sie ausgeschaltet werden kann.",
    "ledTest": "Die interne LED muss initialisiert werden, bevor der Test durchgeführt werden kann.",
    "ledMatrixSetPixel": "Die LED Matrix muss initialisiert werden, bevor Pixel gesetzt werden können.",
    "ledMatrixFill": "Die LED Matrix muss initialisiert werden, bevor sie gefüllt werden kann.",
    "ledMatrixShow": "Die LED Matrix muss initialisiert werden, bevor sie angezeigt werden kann.",
    "ledMatrixOff": "Die LED Matrix muss initialisiert werden, bevor sie ausgeschaltet werden kann.",
    "ledMatrixTest": "Die LED Matrix muss initialisiert werden, bevor der Test durchgeführt werden kann.",
    "oledWrite": "Das OLED muss initialisiert werden, bevor geschrieben werden kann.",
    "oledClear": "Das OLED muss initialisiert werden, bevor es gelöscht werden kann.",
    "oledTest": "Das OLED muss initialisiert werden, bevor der Test durchgeführt werden kann.",
    "dcMotorSet": "DC-Motoren müssen initialisiert werden, bevor die Richtung gesetzt werden kann.",
    "dcMotorStop": "DC-Motoren müssen initialisiert werden, bevor sie gestoppt werden können.",
    "dcMotorTest": "DC-Motoren müssen initialisiert werden, bevor der Test durchgeführt werden kann.",
    "dht11ReadTemp": "DHT11 muss initialisiert werden, bevor die Temperatur gelesen werden kann.",
    "dht11ReadHumidity": "DHT11 muss initialisiert werden, bevor die Luftfeuchtigkeit gelesen werden kann.",
    "dht11Test": "DHT11 muss initialisiert werden, bevor der Test durchgeführt werden kann.",
    "sdcardWrite": "SD Karte muss initialisiert werden, bevor geschrieben werden kann.",
    "sdcardRead": "SD Karte muss initialisiert werden, bevor gelesen werden kann.",
    "sdcardAppend": "SD Karte muss initialisiert werden, bevor angehängt werden kann.",
    "sdcardExists": "SD Karte muss initialisiert werden, bevor die Existenz geprüft werden kann.",
    "sdcardDelete": "SD Karte muss initialisiert werden, bevor Dateien gelöscht werden können.",
    "sdcardTest": "SD Karte muss initialisiert werden, bevor der Test durchgeführt werden kann.",
    "max98357aPlayTone": "MAX98357A muss initialisiert werden, bevor Töne gespielt werden können.",
    "max98357aStop": "MAX98357A muss initialisiert werden, bevor gestoppt werden kann.",
    "max98357aTest": "MAX98357A muss initialisiert werden, bevor der Test durchgeführt werden kann.",
    "max98357aPlayFile": "MAX98357A und SD-Karte müssen initialisiert werden, bevor Audiodateien abgespielt werden können.",
    "max98357aIsPlaying": "MAX98357A muss initialisiert werden, bevor der Wiedergabestatus geprüft werden kann.",
    "max98357aWaitUntilDone": "MAX98357A muss initialisiert werden, bevor auf Audio-Abschluss gewartet werden kann.",
    "ws2812SetPixel": "WS2812 muss initialisiert werden, bevor Pixel gesetzt werden können.",
    "ws2812Fill": "WS2812 muss initialisiert werden, bevor gefüllt werden kann.",
    "ws2812Show": "WS2812 muss initialisiert werden, bevor angezeigt werden kann.",
    "ws2812Off": "WS2812 muss initialisiert werden, bevor ausgeschaltet werden kann.",
    "ws2812Test": "WS2812 muss initialisiert werden, bevor der Test durchgeführt werden kann.",
    "bleRemoteOnDirection": "BLE muss initialisiert werden, bevor der Richtungs-Callback verwendet werden kann.",
    "bleRemoteOnSpeed": "BLE muss initialisiert werden, bevor der Geschwindigkeits-Callback verwendet werden kann.",
    "bleRemoteOnCommand": "BLE muss initialisiert werden, bevor der Befehls-Callback verwendet werden kann.",
    "bleRemoteSend": "BLE muss initialisiert werden, bevor Daten gesendet werden können.",
    "bleRemoteIsConnected": "BLE muss initialisiert werden, bevor die Verbindung geprüft werden kann.",
    "bleRemoteTest": "BLE muss initialisiert werden, bevor der Test durchgeführt werden kann."
  }
});
