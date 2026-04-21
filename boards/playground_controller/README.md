# ESP32-Controller PlatformIO Project

ESP32 game controller board with OLED display and dual joystick support.

## Hardware

- **Board**: ESP32-Controller
- **Microcontroller**: ESP32
- **Framework**: Arduino

## Features

- ✅ Serial communication (115200 baud)
- ✅ Internal LED on GPIO8 (active LOW)
- ✅ Dual joystick support (KY023)
- ✅ Extra buttons (GPIO7, GPIO8, GPIO9, GPIO21)
- ✅ Haptic motor support (GPIO20)
- ✅ OLED display (I2C on GPIO5/GPIO6)
- ✅ PSRAM support
- ✅ Exception decoder for debugging

## GPIO Pin Mapping

| GPIO | Function | Description |
|------|----------|-------------|
| 0 | Joystick Left Button | Left joystick switch |
| 1 | Joystick Left X | Analog input for left joystick X-axis |
| 2 | Joystick Left Y | Analog input for left joystick Y-axis |
| 3 | Joystick Right Button | Right joystick switch |
| 4 | Joystick Right X | Analog input for right joystick X-axis |
| 5 | I2C SDA | OLED display (reserved) |
| 6 | I2C SCL | OLED display (reserved) |
| 7 | Extra Button 2 | Digital input |
| 8 | Internal LED / Extra Button 3 | Built-in LED (active LOW) |
| 9 | BOOT Button / Extra Button 4 | Boot button |
| 10 | Joystick Right Y | Analog input for right joystick Y-axis |
| 20 | Haptic Motor / UART RX | Vibration motor (disables Serial RX) |
| 21 | Extra Button 1 / UART TX | Digital input (disables Serial TX) |

## Getting Started

### Prerequisites

- VS Code with PlatformIO Extension
- USB-C cable for ESP32-Controller

### Installation

1. Clone/Open this project in VS Code
2. PlatformIO will automatically load dependencies
3. Connect your ESP32-Controller via USB

### Build and Upload

1. Open PlatformIO Terminal or use VS Code Tasks
2. Build: `pio run`
3. Upload: `pio run --target upload`
4. Serial Monitor: `pio device monitor`

Or use the PlatformIO GUI in VS Code.

## Project Structure

```
├── platformio.ini          # PlatformIO configuration
├── src/
│   ├── main.cpp            # Main program
│   ├── internalLED.cpp     # LED functionality
│   ├── ky023.cpp           # Joystick support
│   ├── buttons.cpp         # Button handling
│   └── haptic.cpp          # Haptic motor control
├── include/
│   ├── internalLED.h       # LED header
│   ├── ky023.h             # Joystick header
│   ├── buttons.h           # Button header
│   └── haptic.h            # Haptic header
├── .vscode/tasks.json      # VS Code Build/Upload Tasks
├── README.md               # Documentation
└── .gitignore              # Git ignore file
```

## Useful Commands

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

- Make sure ESP32-Controller is in download mode for first upload
- If upload fails: hold BOOT button during upload
- Serial monitor works best at 115200 baud
- GPIO20 and GPIO21 are shared with Serial - using them disables Serial RX/TX

## Next Steps

- Add more sensors/actuators
- Extend project with WiFi, Bluetooth, etc.
- Use ESP32 specific features
