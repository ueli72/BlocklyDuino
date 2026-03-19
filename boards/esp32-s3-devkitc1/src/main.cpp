#include <Arduino.h>
#include "internalLED.h"
#include "LEDMatrix.h"
#include "buttons.h"
#include "servos.h"
#include "ultrasonic.h"
#include "relais.h"
#include "dcmotor.h"
#include "oled.h"
#include "dht11.h"
#include "gyro.h"  // GY-91 9-DOF sensor module (MPU9250 + BMP280)
#include "i2c_scanner.h"
#include "i2c_raw_reader.h"

void setup() {
  // Initialize Serial communication
  Serial.begin(115200);
  
  // Wait for Serial to be ready
  delay(1000);

  Serial.println("\n\n=====================================");
  Serial.println("ESP32-S3 DevKit - GY-91 Test");
  Serial.println("=====================================");
  
  // === INITIALIZE I2C ONCE AT THE START ===
  Serial.println("\nInitializing I2C bus (SDA=8, SCL=9)...");
  Wire.begin(8, 9);
  Wire.setClock(400000);
  Serial.println("I2C bus ready.");
  delay(1000);
  
  // === INITIALIZE OLED FIRST ===
  Serial.println("Initializing OLED display...");
  initOLED();
  delay(500);
  
  // === INITIALIZE SENSORS (NO SCANNER/DIAGNOSTICS) ===
  Serial.println("Initializing sensors...");
  initializeGyro();
  delay(500);
  
  // === RUN THE GYRO TEST ===
  Serial.println("Starting GY-91 sensor test...");
  runGyroTest();

  Serial.println("Setup complete");
}


void loop() {
 
}