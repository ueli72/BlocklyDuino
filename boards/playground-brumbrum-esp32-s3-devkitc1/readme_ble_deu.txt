================================================================================
                    BLUETOOTH LE FERNSTEUERUNG - TESTANLEITUNG
================================================================================

Diese Anleitung erklärt, wie Sie die Bluetooth LE Fernsteuerungs-Blöcke mit
der kostenlosen "LightBlue" App (iOS und Android) testen können.

================================================================================
1. PLAYGROUND BOARD EINRICHTEN
================================================================================

1. Fügen Sie den "BLE Fernsteuerung - Initialisieren" Block zu Ihrem Programm
2. Setzen Sie einen eindeutigen Gerätenamen (z.B. "MeinAuto1", "MeinAuto2")
3. Fügen Sie Callback-Blöcke für die Befehle hinzu, die Sie testen möchten:
   - "Bei Richtung" - empfängt Lenkwinkel (-60 bis +60)
   - "Bei Geschwindigkeit" - empfängt Geschwindigkeit (0-255)
   - "Bei Befehl" - empfängt Befehlswert (0-255)
4. Laden Sie das Programm auf Ihr Playground Board hoch

================================================================================
2. LIGHTBLUE APP INSTALLIEREN
================================================================================

Kostenloser Download aus:
- iOS: App Store - Suche nach "LightBlue"
- Android: Play Store - Suche nach "LightBlue"

Alternative Apps die ebenfalls funktionieren:
- "nRF Connect" (iOS und Android)
- "BLE Terminal" (Android)

================================================================================
3. MIT DEM GERÄT VERBINDEN
================================================================================

1. Öffnen Sie LightBlue
2. Aktivieren Sie Bluetooth auf Ihrem Telefon falls gefragt
3. Suchen Sie nach Geräten (nach unten ziehen oder Scan antippen)
4. Suchen Sie nach Ihrem Gerätenamen (z.B. "MeinAuto1")
5. Tippen Sie auf Ihr Gerät um zu verbinden

================================================================================
4. SERVICE UND CHARAKTERISTIKEN
================================================================================

Nach dem Verbindungsaufbau sehen Sie einen Service mit 4 Charakteristiken:

Service UUID: 0x8001

┌─────────────────────────────────────────────────────────────────────────────┐
│ Charakteristik         │ UUID            │ Typ     │ Eigenschaften           │
├─────────────────────────────────────────────────────────────────────────────┤
│ Richtung               │ 0x8002          │ int8    │ Write, Notify           │
│ Geschwindigkeit        │ 0x8003          │ uint8   │ Write, Notify           │
│ Befehl                 │ 0x8004          │ uint8   │ Read, Write             │
│ Sensordaten            │ 0x8005          │ string  │ Notify                  │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
5. BEFEHLE SENDEN
================================================================================

RICHTUNG (Lenkung)
------------------
1. Tippen Sie auf die Richtungs-Charakteristik (0x8002)
2. Tippen Sie auf die "Write" Schaltfläche (Bleistift-Symbol)
3. Geben Sie einen Hex-Wert ein (ohne 0x-Präfix), z.B.:
   - 00 = geradeaus (0)
   - 3C = voll rechts (+60)
   - C4 = voll links (-60, als unsigned: 0xC4 = 196)
4. Tippen Sie auf "Write" oder "Send"

Hinweis: Werte werden als signed int8 gesendet:
- 0x00 bis 0x7F = 0 bis +127
- 0x80 bis 0xFF = -128 bis -1

GESCHWINDIGKEIT
---------------
1. Tippen Sie auf die Geschwindigkeits-Charakteristik (0x8003)
2. Tippen Sie auf die "Write" Schaltfläche
3. Geben Sie einen Hex-Wert ein (ohne 0x-Präfix), z.B.:
   - 00 = gestoppt (0)
   - FF = maximale Geschwindigkeit (255)
4. Tippen Sie auf "Write" oder "Send"

BEFEHL
------
1. Tippen Sie auf die Befehls-Charakteristik (0x8004)
2. Tippen Sie auf die "Write" Schaltfläche
3. Geben Sie einen Hex-Wert ein (ohne 0x-Präfix), z.B.:
   - 00 = Befehl 0
   - 01 = Befehl 1
   - FF = Befehl 255
4. Tippen Sie auf "Write" oder "Send"

================================================================================
6. SENSORDATEN EMPFANGEN
================================================================================

Wenn Ihr Programm den "BLE Fernsteuerung - Daten senden" Block verwendet:

1. Tippen Sie auf die Sensordaten-Charakteristik (0x8005)
2. Tippen Sie auf die "Subscribe" Schaltfläche (Glocken-Symbol)
3. Vom Playground gesendete Daten erscheinen als Benachrichtigungen
4. Die Daten werden als Textzeichenfolge gesendet

================================================================================
7. TESTBEISPIEL
================================================================================

Beispiel BlocklyDuino Programm zum Testen:

┌─────────────────────────────────────────────────────────────────────────────┐
│ Setup:                                                                      │
│   [BLE Fernsteuerung Initialisieren Name: "TestAuto"]                      │
│   [DC Motor Initialisieren]                                                 │
│                                                                             │
│   [BLE Fernsteuerung Bei Richtung]                                          │
│   └─ do: [DC Motor Richtung setzen: direction]                             │
│                                                                             │
│   [BLE Fernsteuerung Bei Geschwindigkeit]                                   │
│   └─ do: [DC Motor Geschwindigkeit setzen: speed]                          │
│                                                                             │
│   [BLE Fernsteuerung Bei Befehl]                                            │
│   └─ do: [wenn command == 1]                                                │
│            └─ [Ton spielen 440Hz für 500ms]                                 │
│                                                                             │
│ Schleife:                                                                   │
│   (leer - Callbacks erledigen alles)                                        │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
8. FEHLERBEHEBUNG
================================================================================

Gerät nicht gefunden:
- Stellen Sie sicher, dass das Programm auf dem Playground läuft
- Prüfen Sie, ob Bluetooth auf dem Telefon aktiviert ist
- Versuchen Sie, das Playground Board neu zu starten
- Stellen Sie sicher, dass kein anderes Gerät bereits verbunden ist

Verbindung nicht möglich:
- Trennen Sie zuerst andere Bluetooth-Geräte
- Starten Sie die nRF Connect App neu
- Schalten Sie das Playground Board aus und wieder ein

Befehle funktionieren nicht:
- Prüfen Sie, ob die Callback-Blöcke richtig verbunden sind
- Überprüfen Sie die korrekte Charakteristik-UUID
- Stellen Sie sicher, dass Sie in die richtige Charakteristik schreiben
- Prüfen Sie den Serial Monitor für Debug-Ausgaben (BLE Test Block verwenden)

Verbindung bricht ab:
- Bewegen Sie sich näher zum Gerät (BLE Reichweite ~10m)
- Prüfen Sie die Batterie/Stromversorgung
- Reduzieren Sie die Häufigkeit der Befehle

================================================================================
9. EIGENE MOBILE APP ERSTELLEN
================================================================================

Wenn Sie eine eigene mobile App erstellen möchten, verwenden Sie diese Bibliotheken:

Flutter:
  flutter_blue_plus: ^1.31.0
  
React Native:
  react-native-ble-plx: ^3.0.0

Kotlin (Android):
  Nordic BLE Library: no.nordicsemi.android:ble

Swift (iOS):
  CoreBluetooth Framework (integriert)

Service und Charakteristik UUIDs für Ihre App:

const SERVICE_UUID = "8001";
const CHAR_DIRECTION = "8002";
const CHAR_SPEED = "8003";
const CHAR_COMMAND = "8004";
const CHAR_SENSOR = "8005";

================================================================================
10. ISR EINSCHRÄNKUNGEN (WICHTIG!)
================================================================================

Die Callback-Blöcke laufen im BLE Interrupt-Kontext. Folgendes ist VERBOTEN:

❌ KEIN delay() oder delayMicroseconds()
❌ KEIN Serial.print() oder Serial.write()
❌ KEINE OLED-Operationen (init, write, clear)
❌ KEINE SD-Karten-Operationen
❌ KEINE DHT11-Lesevorgänge
❌ KEINE Ultraschall-Messungen
❌ KEINE MAX98357A Audio-Operationen
❌ KEINE Internal LED oder LED Matrix (WS2812)

✅ ERLAUBTE Operationen:
   - DC Motor Steuerung (Geschwindigkeit setzen, stoppen)
   - Relais Steuerung
   - Servo-Bewegung
   - Variablenzuweisungen
   - Einfache Berechnungen

Wenn Sie Sensoren auslesen müssen, tun Sie dies in der Hauptschleife und
senden Sie die Daten mit dem "BLE Fernsteuerung - Daten senden" Block.

================================================================================
