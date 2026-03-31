# BlocklyDuino - BWS Uster Edition

A web-based visual programming editor for Arduino, specialized for educational boards created by **Berufswahlschule Uster, Switzerland** ([www.bws-uster.ch](https://www.bws-uster.ch)).

> **Fork of [BlocklyDuino](https://github.com/gasolin/BlocklyDuino)** - Updated for modern browsers (Chrome, Firefox, Edge) with enhanced features for educational use.

**Live Demo:** [blockly.bws-uster.ch](https://blockly.bws-uster.ch)

## Features

### Visual Programming
- Drag-and-drop block programming for Arduino
- Real-time Arduino code generation
- XML save/load for sharing projects
- Bilingual interface (English/German)

### Supported Boards
- **BWS Playground Master** (ESP32-S3 DevKitC-1) - Custom educational board
- **Arduino Uno** - Classic Arduino board

### Component Blocks

| Category | Components |
|----------|------------|
| **Output** | Internal RGB LED, LED Matrix, OLED Display, WS2812 LED Strip, Relays, DC Motors, SG90 Servos |
| **Input** | Buttons (with interrupt support), KY023 Joystick, Brightness Sensor (LDR) |
| **Sensors** | DHT11 (Temperature/Humidity), Ultrasonic Distance |
| **Audio** | MAX98357A I2S Amplifier (tone playback, WAV files) |
| **Storage** | SD Card (read/write/delete files) |
| **Communication** | Serial (USB), Bluetooth LE Remote Control |
| **Programming** | Variables, Arrays, Functions, Custom Code blocks |

### Educational Features
- **Test blocks** for every component - verify hardware connections
- **Dependency checking** - warns when components need initialization
- **ISR restrictions** - prevents invalid code in interrupts/timers
- **Interactive test menu** - test all components via OLED menu

### Project Export
- **One-click download** creates a complete **VSCode/PlatformIO project** as ZIP
- Includes all source files, headers, `platformio.ini`, and VSCode settings
- **Ready to use:** Extract, open in VSCode, and compile/upload immediately
- Perfect for students to continue coding in a professional IDE

## BWS Playground Master Pinout

| Component | Pin(s) | Notes |
|-----------|--------|-------|
| **Internal RGB LED** | GPIO 48 | WS2812B NeoPixel |
| **LED Matrix (16 LEDs)** | GPIO 10 | WS2812B NeoPixel |
| **OLED Display** | SDA: GPIO 8, SCL: GPIO 9 | I2C (0x78) |
| **Buttons** | SW1: GPIO 1, SW2: GPIO 4, SW3: GPIO 3, SW4: GPIO 2 | Active LOW |
| **SG90 Servos** | Servo1: GPIO 37, Servo2: GPIO 38, Servo3: GPIO 45 | External 5-6V required |
| **DC Motors** | M1: GPIO 15/16, M2: GPIO 43/44, M3: GPIO 0/7, M4: GPIO 12/13 | External power required |
| **Relays** | Relay1: GPIO 48, Relay2: GPIO 47 | External 5V required |
| **DHT11** | GPIO 6 | Temperature & Humidity |
| **Ultrasonic** | Front: TRIG 17/ECHO 35, Back: TRIG 14/ECHO 21 | External 5V required |
| **SD Card** | CS: GPIO 5, MOSI: GPIO 20, CLK: GPIO 18, MISO: GPIO 19 | SPI |
| **MAX98357A Audio** | BCLK: GPIO 41, LRC: GPIO 42, DIN: GPIO 40, SD_MODE: GPIO 39 | I2S |
| **WS2812 LED Strip** | Configurable | External power for long strips |
| **KY023 Joystick** | Configurable (X, Y, Button pins) | Analog + Digital |
| **Brightness Sensor** | Configurable (analog pin) | GL5546 LDR |

> ⚠️ **Note:** Some components require external 5V power. See block tooltips in the app for details.

## Quick Start

### Option 1: Use Online Demo
Visit [blockly.bws-uster.ch](https://blockly.bws-uster.ch) - no installation required.

### Option 2: Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/BlocklyDuino.git
   cd BlocklyDuino
   ```

2. Serve the `blocklyduino/` directory:
   ```bash
   # Using Python
   python3 -m http.server 8080 --directory blocklyduino
   
   # Using Node.js
   npx serve blocklyduino
   
   # Using PHP
   php -S localhost:8080 -t blocklyduino
   ```

3. Open http://localhost:8080 in your browser

### Option 3: Deploy to GitHub Pages
1. Fork this repository
2. Go to Settings → Pages
3. Set Source to `main` branch, folder `/ (root)`
4. Your app will be available at `https://YOUR_USERNAME.github.io/BlocklyDuino/blocklyduino/`

### Option 4: Deploy to Web Server
Copy the `blocklyduino/` directory to your web server's public folder:
```bash
cp -r blocklyduino/ /var/www/html/blocklyduino/
# Access at: http://your-server.com/blocklyduino/
```

## Usage

1. Open the app in your browser
2. Select your board (BWS Playground Master or Arduino Uno)
3. Drag blocks from the toolbox to create your program
4. Click the **Arduino** tab to see generated code
5. Click **Download** to get a complete PlatformIO project as ZIP
6. Extract the ZIP and open in VSCode:
   ```bash
   unzip MyProject.zip -d MyProject
   code MyProject
   ```
7. Compile and upload with PlatformIO:
   ```bash
   pio run -t upload
   ```

The downloaded project includes:
- `src/main.cpp` - Your generated Arduino code
- `include/*.h` - Header files for all components
- `src/*.cpp` - Implementation files
- `platformio.ini` - Board configuration
- `.vscode/` - VSCode settings for IntelliSense

## Development

### Project Structure
```
blocklyduino/          # Web app (self-contained, serve this)
├── index.html         # Main application
├── blocks/            # Block definitions
│   └── playground/    # Component-specific blocks
├── generators/        # Arduino code generators
│   └── arduino/playground/
├── media/             # Block images
├── lang/              # Translations (en.js, de.js)
└── templates.js       # Board templates (auto-generated)

boards/                # PlatformIO source files
├── esp32-s3-devkitc1/ # BWS Playground Master
│   ├── include/       # Header files
│   └── src/           # Implementation files
└── arduino-uno/       # Arduino Uno template
```

### Regenerate Templates
After modifying board source files:
```bash
python3 generate_templates.py
```

### Add a New Block
1. Create block definition: `blocklyduino/blocks/playground/myblock.js`
2. Create code generator: `blocklyduino/generators/arduino/playground/myblock.js`
3. Register in `index.html` (script includes + toolbox)
4. Add translations in `lang/en.js` and `lang/de.js`
5. Add block info in `block_info.js`

See [AGENTS.md](AGENTS.md) for detailed instructions.

## Requirements

- **Browser:** Chrome, Firefox, or Edge (modern versions)
- **Upload:** PlatformIO or Arduino IDE

## Credits

- Original BlocklyDuino by [Fred Lin (@gasolin)](https://github.com/gasolin)
- Google [Blockly](https://developers.google.com/blockly/) visual programming library
- BWS Uster enhancements and ESP32-S3 board support

## License

Apache License 2.0
