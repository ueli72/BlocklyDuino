================================================================================
                    BLUETOOTH LE FERNSTEUERUNG - TESTANLEITUNG
================================================================================

Diese Anleitung erklärt, wie Sie die Bluetooth LE Fernsteuerungs-Blöcke mit
der kostenlosen "nRF Connect" App (iOS und Android) testen können.

================================================================================
1. PLAYGROUND BOARD EINRICHTEN
================================================================================

1. Fügen Sie den "BLE Fernsteuerung - Initialisieren" Block zu Ihrem Programm
2. Setzen Sie einen eindeutigen Gerätenamen (z.B. "MeinAuto1", "MeinAuto2")
3. Fügen Sie Callback-Blöcke für die Befehle hinzu, die Sie testen möchten:
   - "Bei Richtung" - empfängt Lenkwinkel (-60 bis +60)
   - "Bei Geschwindigkeit" - empfängt Geschwindigkeit (0-255)
   - "Bei Befehl" - empfängt benutzerdefinierte Textbefehle
4. Laden Sie das Programm auf Ihr Playground Board hoch

================================================================================
2. NRF CONNECT APP INSTALLIEREN
================================================================================

Kostenloser Download aus:
- iOS: App Store - Suche nach "nRF Connect"
- Android: Play Store - Suche nach "nRF Connect"

Alternative Apps die ebenfalls funktionieren:
- "BLE Terminal" (Android)
- "LightBlue" (iOS)

================================================================================
3. MIT DEM GERÄT VERBINDEN
================================================================================

1. Öffnen Sie nRF Connect
2. Aktivieren Sie Bluetooth auf Ihrem Telefon falls gefragt
3. Ziehen Sie nach unten um nach Geräten zu suchen
4. Suchen Sie nach Ihrem Gerätenamen (z.B. "MeinAuto1")
5. Tippen Sie auf "VERBINDEN" neben Ihrem Gerät

================================================================================
4. SERVICE UND CHARAKTERISTIKEN
================================================================================

Nach dem Verbindungsaufbau sehen Sie einen Service mit 4 Charakteristiken:

Service UUID: 4fafc201-1fb5-459e-8fcc-c5e9f8f1c9ab

┌─────────────────────────────────────────────────────────────────────────────┐
│ Charakteristik         │ UUID (kurz)    │ Typ     │ Eigenschaften           │
├─────────────────────────────────────────────────────────────────────────────┤
│ Richtung               │ ...26a8         │ int8    │ Write, Notify           │
│ Geschwindigkeit        │ ...26a9         │ uint8   │ Write, Notify           │
│ Befehl                 │ ...26aa         │ string  │ Write                   │
│ Sensordaten            │ ...26ab         │ string  │ Notify                  │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
5. BEFEHLE SENDEN
================================================================================

RICHTUNG (Lenkung)
------------------
1. Tippen Sie auf die Richtungs-Charakteristik (...26a8)
2. Tippen Sie auf die "Write" Schaltfläche (Bleistift-Symbol)
3. Geben Sie einen Wert zwischen -60 und +60 ein
   - -60 = voll links
   -   0 = geradeaus
   - +60 = voll rechts
4. Tippen Sie auf "Write" oder "Send"

Hinweis: Sie müssen den Wert als einzelnes Byte senden (hex oder signed int8)
- In nRF Connect wählen Sie das "Signed" Format
- Eingabe: -60 bis +60

GESCHWINDIGKEIT
---------------
1. Tippen Sie auf die Geschwindigkeits-Charakteristik (...26a9)
2. Tippen Sie auf die "Write" Schaltfläche
3. Geben Sie einen Wert zwischen 0 und 255 ein
   -   0 = gestoppt
   - 255 = maximale Geschwindigkeit
4. Tippen Sie auf "Write" oder "Send"

BENUTZERDEFINIERTE BEFEHLE
--------------------------
1. Tippen Sie auf die Befehls-Charakteristik (...26aa)
2. Tippen Sie auf die "Write" Schaltfläche
3. Geben Sie einen Textbefehl ein, z.B.:
   - "light_on"
   - "light_off"
   - "honk"
   - "stop"
4. Tippen Sie auf "Write" oder "Send"

================================================================================
6. SENSORDATEN EMPFANGEN
================================================================================

Wenn Ihr Programm den "BLE Fernsteuerung - Daten senden" Block verwendet:

1. Tippen Sie auf die Sensordaten-Charakteristik (...26ab)
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
│   └─ do: [wenn command == "honk"]                                          │
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

const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5e9f8f1c9ab";
const CHAR_DIRECTION = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
const CHAR_SPEED = "beb5483e-36e1-4688-b7f5-ea07361b26a9";
const CHAR_COMMAND = "beb5483e-36e1-4688-b7f5-ea07361b26aa";
const CHAR_SENSOR = "beb5483e-36e1-4688-b7f5-ea07361b26ab";

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
❌ KEIN Internal LED init

✅ ERLAUBTE Operationen:
   - DC Motor Steuerung (Geschwindigkeit setzen, stoppen)
   - WS2812 LED Steuerung
   - LED Matrix Steuerung
   - Relais Steuerung
   - Servo-Bewegung
   - Variablenzuweisungen
   - Einfache Berechnungen

Wenn Sie Sensoren auslesen müssen, tun Sie dies in der Hauptschleife und
senden Sie die Daten mit dem "BLE Fernsteuerung - Daten senden" Block.

================================================================================
