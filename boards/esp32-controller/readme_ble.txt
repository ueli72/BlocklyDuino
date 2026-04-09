================================================================================
                    BLUETOOTH LE REMOTE CONTROL - TESTING GUIDE
================================================================================

This guide explains how to test the Bluetooth LE Remote Control blocks using
the free "LightBlue" mobile app (available on iOS and Android).

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
2. INSTALL LIGHTBLUE APP
================================================================================

Download the free app from:
- iOS: App Store - search "LightBlue"
- Android: Play Store - search "LightBlue"

Alternative apps that also work:
- "nRF Connect" (iOS and Android)
- "BLE Terminal" (Android)

================================================================================
3. CONNECT TO YOUR DEVICE
================================================================================

1. Open LightBlue
2. Enable Bluetooth on your phone if prompted
3. Scan for devices (pull down or tap scan)
4. Look for your device name (e.g., "MyCar1")
5. Tap on your device to connect

================================================================================
4. SERVICE AND CHARACTERISTICS
================================================================================

Once connected, you'll see a service with 4 characteristics:

Service UUID: 0x8001

┌─────────────────────────────────────────────────────────────────────────────┐
│ Characteristic        │ UUID            │ Type    │ Properties              │
├─────────────────────────────────────────────────────────────────────────────┤
│ Direction             │ 0x8002          │ int8    │ Write, Notify           │
│ Speed                 │ 0x8003          │ uint8   │ Write, Notify           │
│ Command               │ 0x8004          │ uint8   │ Read, Write             │
│ Sensor Data           │ 0x8005          │ string  │ Notify                  │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
5. SENDING COMMANDS
================================================================================

DIRECTION (Steering)
--------------------
1. Tap on the Direction characteristic (0x8002)
2. Tap the "Write" button (pencil icon)
3. Enter a hex value (without 0x prefix), e.g.:
   - 00 = straight (0)
   - 3C = full right (+60)
   - C4 = full left (-60, as unsigned: 0xC4 = 196)
4. Tap "Write" or "Send"

Note: Values are sent as signed int8:
- 0x00 to 0x7F = 0 to +127
- 0x80 to 0xFF = -128 to -1

SPEED
-----
1. Tap on the Speed characteristic (0x8003)
2. Tap the "Write" button
3. Enter a hex value (without 0x prefix), e.g.:
   - 00 = stopped (0)
   - FF = maximum speed (255)
4. Tap "Write" or "Send"

COMMAND
-------
1. Tap on the Command characteristic (0x8004)
2. Tap the "Write" button
3. Enter a hex value (without 0x prefix), e.g.:
   - 00 = command 0
   - 01 = command 1
   - FF = command 255
4. Tap "Write" or "Send"

================================================================================
6. RECEIVING SENSOR DATA
================================================================================

If your program uses the "BLE Remote - Send" block:

1. Tap on the Sensor Data characteristic (0x8005)
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
│   └─ do: [if command == 1]                                                  │
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

const SERVICE_UUID = "8001";
const CHAR_DIRECTION = "8002";
const CHAR_SPEED = "8003";
const CHAR_COMMAND = "8004";
const CHAR_SENSOR = "8005";

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
❌ NO Internal LED or LED Matrix (WS2812)

✅ ALLOWED operations:
   - DC Motor control (set speed, stop)
   - Relay control
   - Servo movement
   - Variable assignments
   - Simple calculations

If you need to read sensors, do it in the main loop and send data using
the "BLE Remote - Send" block.

================================================================================
