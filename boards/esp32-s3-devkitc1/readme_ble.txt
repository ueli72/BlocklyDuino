================================================================================
                    BLUETOOTH LE REMOTE CONTROL - TESTING GUIDE
================================================================================

This guide explains how to test the Bluetooth LE Remote Control blocks using
the free "nRF Connect" mobile app (available on iOS and Android).

================================================================================
1. SETUP THE PLAYGROUND BOARD
================================================================================

1. Add the "BLE Remote - Initialize" block to your program
2. Set a unique device name (e.g., "MyCar1", "MyCar2" for multiple cars)
3. Add callback blocks for the commands you want to test:
   - "On Direction" - receives steering angle (-60 to +60)
   - "On Speed" - receives speed value (0-255)
   - "On Command" - receives custom string commands
4. Upload the program to your Playground board

================================================================================
2. INSTALL nRF CONNECT APP
================================================================================

Download the free app from:
- iOS: App Store - search "nRF Connect"
- Android: Play Store - search "nRF Connect"

Alternative apps that also work:
- "BLE Terminal" (Android)
- "LightBlue" (iOS)

================================================================================
3. CONNECT TO YOUR DEVICE
================================================================================

1. Open nRF Connect
2. Enable Bluetooth on your phone if prompted
3. Pull down to scan for devices
4. Look for your device name (e.g., "MyCar1")
5. Tap "CONNECT" next to your device

================================================================================
4. SERVICE AND CHARACTERISTICS
================================================================================

Once connected, you'll see a service with 4 characteristics:

Service UUID: 4fafc201-1fb5-459e-8fcc-c5e9f8f1c9ab

┌─────────────────────────────────────────────────────────────────────────────┐
│ Characteristic        │ UUID (short)    │ Type    │ Properties              │
├─────────────────────────────────────────────────────────────────────────────┤
│ Direction             │ ...26a8         │ int8    │ Write, Notify           │
│ Speed                 │ ...26a9         │ uint8   │ Write, Notify           │
│ Command               │ ...26aa         │ string  │ Write                   │
│ Sensor Data           │ ...26ab         │ string  │ Notify                  │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
5. SENDING COMMANDS
================================================================================

DIRECTION (Steering)
--------------------
1. Tap on the Direction characteristic (...26a8)
2. Tap the "Write" button (pencil icon)
3. Enter a value between -60 and +60
   - -60 = full left
   -   0 = straight
   - +60 = full right
4. Tap "Write" or "Send"

Note: You need to send the value as a single byte (hex or signed int8)
- In nRF Connect, select "Signed" format
- Enter: -60 to +60

SPEED
-----
1. Tap on the Speed characteristic (...26a9)
2. Tap the "Write" button
3. Enter a value between 0 and 255
   -   0 = stopped
   - 255 = maximum speed
4. Tap "Write" or "Send"

CUSTOM COMMANDS
---------------
1. Tap on the Command characteristic (...26aa)
2. Tap the "Write" button
3. Enter a text command, e.g.:
   - "light_on"
   - "light_off"
   - "honk"
   - "stop"
4. Tap "Write" or "Send"

================================================================================
6. RECEIVING SENSOR DATA
================================================================================

If your program uses the "BLE Remote - Send" block:

1. Tap on the Sensor Data characteristic (...26ab)
2. Tap the "Subscribe" button (notification icon)
3. Data sent from the Playground will appear as notifications
4. The data is sent as a text string

================================================================================
7. TESTING EXAMPLE
================================================================================

Example BlocklyDuino program for testing:

┌─────────────────────────────────────────────────────────────────────────────┐
│ Setup:                                                                      │
│   [BLE Remote Initialize Name: "TestCar"]                                  │
│   [DC Motor Initialize]                                                     │
│                                                                             │
│   [BLE Remote On Direction]                                                 │
│   └─ do: [DC Motor Set Direction: direction]                               │
│                                                                             │
│   [BLE Remote On Speed]                                                     │
│   └─ do: [DC Motor Set Speed: speed]                                        │
│                                                                             │
│   [BLE Remote On Command]                                                   │
│   └─ do: [if command == "honk"]                                             │
│            └─ [play tone 440Hz for 500ms]                                   │
│                                                                             │
│ Loop:                                                                       │
│   (empty - callbacks handle everything)                                     │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
8. TROUBLESHOOTING
================================================================================

Device not found:
- Make sure the program is running on the Playground
- Check that Bluetooth is enabled on your phone
- Try restarting the Playground board
- Make sure no other device is already connected

Cannot connect:
- Disconnect from other Bluetooth devices first
- Restart the nRF Connect app
- Power cycle the Playground board

Commands not working:
- Check that callback blocks are properly connected
- Verify the correct characteristic UUID
- Make sure you're writing to the correct characteristic
- Check Serial Monitor for debug output (use BLE Test block)

Connection drops:
- Move closer to the device (BLE range ~10m)
- Check battery/power supply
- Reduce the frequency of commands

================================================================================
9. CREATING YOUR OWN MOBILE APP
================================================================================

If you want to create a custom mobile app, use these libraries:

Flutter:
  flutter_blue_plus: ^1.31.0
  
React Native:
  react-native-ble-plx: ^3.0.0

Kotlin (Android):
  Nordic BLE Library: no.nordicsemi.android:ble

Swift (iOS):
  CoreBluetooth framework (built-in)

Service and Characteristic UUIDs for your app:

const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5e9f8f1c9ab";
const CHAR_DIRECTION = "beb5483e-36e1-4688-b7f5-ea07361b26a8";
const CHAR_SPEED = "beb5483e-36e1-4688-b7f5-ea07361b26a9";
const CHAR_COMMAND = "beb5483e-36e1-4688-b7f5-ea07361b26aa";
const CHAR_SENSOR = "beb5483e-36e1-4688-b7f5-ea07361b26ab";

================================================================================
10. ISR RESTRICTIONS (IMPORTANT!)
================================================================================

The callback blocks run in BLE interrupt context. The following are FORBIDDEN:

❌ NO delay() or delayMicroseconds()
❌ NO Serial.print() or Serial.write()
❌ NO OLED operations (init, write, clear)
❌ NO SD Card operations
❌ NO DHT11 reads
❌ NO Ultrasonic reads
❌ NO MAX98357A audio operations
❌ NO Internal LED init

✅ ALLOWED operations:
   - DC Motor control (set speed, stop)
   - WS2812 LED control
   - LED Matrix control
   - Relay control
   - Servo movement
   - Variable assignments
   - Simple calculations

If you need to read sensors, do it in the main loop and send data using
the "BLE Remote - Send" block.

================================================================================
