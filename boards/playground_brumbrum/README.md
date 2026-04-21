# Playground BrumBrum (ESP32-S3) PlatformIO Project

Spezialisiertes Board der BWS Uster für ein RC-Auto, basierend auf dem ESP32-S3 DevKit mit Arduino Framework.

## Hardware

- **Board**: ESP32-S3-DevKitC-1
- **Mikrocontroller**: ESP32-S3
- **Framework**: Arduino

## Features

- ✅ Serial communication (115200 baud)
- ✅ WS2812B RGB LED control (Pin 48) via native ESP32 functions
- ✅ LED Initialisierungstest (Rot → Grün → Blau)
- ✅ Rainbow-Effekt im Hauptprogramm
- ✅ Button input (Boot button, Pin 0)
- ✅ PSRAM Unterstützung
- ✅ Exception decoder für debugging
- ✅ Modularer LED-Code in separater Bibliothek

## Erste Schritte

### Voraussetzungen

- VS Code mit PlatformIO Extension
- USB-C Kabel für ESP32-S3 DevKit

### Installation

1. Klonen/Öffnen Sie dieses Projekt in VS Code
2. PlatformIO wird automatisch die Abhängigkeiten laden
3. Verbinden Sie Ihr ESP32-S3 DevKit via USB

### Build und Upload

1. Öffnen Sie PlatformIO Terminal oder verwenden Sie VS Code Tasks
2. Build: `pio run`
3. Upload: `pio run --target upload`
4. Serial Monitor: `pio device monitor`

Oder verwenden Sie die PlatformIO GUI in VS Code.

## Pin Mapping

| Pin | Funktion | Beschreibung |
|-----|----------|--------------|
| 48  | LED_BUILTIN | Built-in RGB LED |
| 0   | USER_BUTTON | Boot Button (INPUT_PULLUP) |

## Projektstruktur

```
├── platformio.ini          # PlatformIO Konfiguration
├── src/
│   ├── main.cpp            # Hauptprogramm (Button handling + loop)
│   └── internalLED.cpp     # LED Funktionalität und Tests
├── include/
│   └── internalLED.h       # LED Header-Datei
├── .vscode/tasks.json      # VS Code Build/Upload Tasks  
├── .github/copilot-instructions.md # Projekt-spezifische Anweisungen
├── README.md              # Vollständige Dokumentation
├── .gitignore             # Git ignore file
└── lib/                   # Lokale Libraries
```

## Erweiterte Konfiguration

Die `platformio.ini` Datei enthält:
- ESP32-S3 spezifische Build-Flags
- PSRAM Unterstützung
- Exception decoder für besseres debugging
- Upload und Monitor Geschwindigkeiten

## Nützliche Befehle

```bash
# Build
pio run

# Upload to device
pio run --target upload

# Open serial monitor  
pio device monitor

# Clean build files
pio run --target clean

# Update libraries
pio pkg update
```

## Troubleshooting

- Stellen Sie sicher, dass der ESP32-S3 im Download-Modus ist beim ersten Upload
- Bei Problemen mit dem Upload: Boot-Button gedrückt halten während des Uploads
- Serial Monitor funktioniert am besten mit 115200 baud

## Next Steps

- Fügen Sie weitere Sensoren/Aktoren hinzu
- Erweitern Sie das Projekt mit WiFi, Bluetooth, etc.
- Nutzen Sie die ESP32-S3 spezifischen Features wie AI acceleration
