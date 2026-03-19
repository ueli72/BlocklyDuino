#include "gyro.h"
#include "oled.h"
#include "buttons.h"
#include "mpu6500_raw.h"

// Global sensor objects (using raw I2C for MPU6500)
// Adafruit_MPU6050 mpu;  // No longer used - using mpu6500_raw.h instead
Adafruit_BMP280 bmp280;

// Reference pressure for altitude calculation (sea level)
static float seaLevelPressure = 101325.0;

/**
 * Initialize the GY-91 module (MPU6500 variant + BMP280 via Adafruit libraries)
 * Sets up I2C communication and configures both sensors
 */
void initializeGyro() {
  Serial.println("\n=== Initializing GY-91 module (MPU6500/MPU9250 variant) ===");
  
  // CRITICAL: Reinitialize Wire explicitly even though main.cpp did it
  // This ensures the Wire object is in a clean state
  Serial.println("Reinitializing Wire I2C bus...");
  Wire.end();
  delay(100);
  Wire.begin(8, 9);
  Wire.setClock(400000);
  Serial.println("Wire I2C ready.");
  delay(500);
  
  // Test raw I2C communication to MPU6500
  Serial.println("\nTesting raw I2C communication to MPU6500...");
  Wire.beginTransmission(0x68);
  uint8_t error = Wire.endTransmission();
  if (error == 0) {
    Serial.println("✓ Raw I2C: Device at 0x68 responds");
  } else {
    Serial.printf("✗ Raw I2C: Device at 0x68 error code %d\n", error);
  }
  
  // Initialize MPU6500 using raw I2C (not Adafruit library)
  Serial.println("\nInitializing MPU6500 (raw I2C implementation)...");
  if (!mpu6500_init()) {
    Serial.println("  ERROR: Failed to initialize MPU6500");
  } else {
    Serial.println("  SUCCESS: MPU6500 initialized");
  }
  
  // Initialize BMP280
  Serial.println("\nInitializing BMP280...");
  Serial.printf("  Expected address: 0x%02X\n", BMP280_ADDRESS);
  
  if (!bmp280.begin(BMP280_ADDRESS)) {
    Serial.println("  ERROR: BMP280 not found! Check I2C connection and address.");
  } else {
    Serial.println("  SUCCESS: BMP280 initialized");
    
    // Configure BMP280
    bmp280.setSampling(Adafruit_BMP280::MODE_NORMAL,
                       Adafruit_BMP280::SAMPLING_X2,     // Temperature oversampling
                       Adafruit_BMP280::SAMPLING_X16,    // Pressure oversampling
                       Adafruit_BMP280::FILTER_X16,      // Filter coefficient
                       Adafruit_BMP280::STANDBY_MS_500); // Standby time
  }
  
  // Configure button as input
  pinMode(TEST_BUTTON_PIN, INPUT_PULLUP);
  Serial.printf("  Button configured on pin %d\n", TEST_BUTTON_PIN);
  
  Serial.println("\n=== GY-91 module initialization complete ===");
  delay(500);
}

/**
 * Read data from all sensors (MPU6500 raw I2C + BMP280)
 * Stores results in the provided SensorData_t structure
 */
void readGyroData(SensorData_t* data) {
  if (data == NULL) return;
  
  // Initialize all values to 0 first to avoid uninitialized garbage
  data->accelX = 0;
  data->accelY = 0;
  data->accelZ = 0;
  data->gyroX = 0;
  data->gyroY = 0;
  data->gyroZ = 0;
  data->magX = 0;
  data->magY = 0;
  data->magZ = 0;
  data->temperature = 0;
  data->bmp_temperature = 0;
  data->pressure = 0;
  data->altitude = 0;
  data->heading = 0;
  
  // Read from MPU6500 using raw I2C
  MPU6500Data mpu_data;
  if (mpu6500_read(&mpu_data)) {
    data->accelX = mpu_data.accelX;
    data->accelY = mpu_data.accelY;
    data->accelZ = mpu_data.accelZ;
    
    data->gyroX = mpu_data.gyroX;
    data->gyroY = mpu_data.gyroY;
    data->gyroZ = mpu_data.gyroZ;
    
    data->temperature = mpu_data.temperature;
  }
  
  // Note: MPU6500 doesn't have magnetometer
  // Using gyro Z as heading proxy for now
  data->magX = 0;
  data->magY = 0;
  data->magZ = 0;
  data->heading = fmod(fabs(data->gyroZ), 360.0);
  
  // Read BMP280 data
  float bmp_temp = bmp280.readTemperature();
  float press = bmp280.readPressure();
  float alt = bmp280.readAltitude(seaLevelPressure);
  
  // Only store if values seem reasonable
  if (bmp_temp > -50 && bmp_temp < 150) {
    data->temperature = bmp_temp;  // °C
    data->bmp_temperature = bmp_temp;
  } else {
    Serial.printf("WARNING: BMP280 temperature out of range: %.2f°C\n", bmp_temp);
  }
  
  if (press > 30000 && press < 120000) {
    data->pressure = press;  // Pa
  } else {
    Serial.printf("WARNING: BMP280 pressure out of range: %.0f Pa\n", press);
  }
  
  if (!isnan(alt) && alt > -1000 && alt < 10000) {
    data->altitude = alt;  // m
  } else {
    Serial.printf("WARNING: BMP280 altitude invalid or out of range: %.2f m\n", alt);
  }
}

/**
 * Print sensor data to Serial monitor
 */
void printSensorData(const SensorData_t* data) {
  if (data == NULL) return;
  
  Serial.println("===== GY-91 Sensor Data =====");
  
  Serial.println("--- Accelerometer (m/s²) ---");
  Serial.printf("  X: %7.2f  Y: %7.2f  Z: %7.2f\n", data->accelX, data->accelY, data->accelZ);
  
 Serial.println("--- Gyroscope (°/s) ---");
  Serial.printf("  X: %7.2f  Y: %7.2f  Z: %7.2f\n", data->gyroX, data->gyroY, data->gyroZ);
  
  Serial.println("--- Environmental ---");
  Serial.printf("  Temp: %6.2f°C  Press: %6.2f hPa  Alt: %6.2f m\n",
                data->temperature, data->pressure / 100.0, data->altitude);
  
  Serial.printf("  Heading (from gyro Z): %6.1f°\n", data->heading);
  Serial.println("=============================\n");
}

/**
 * Calculate magnetic heading from magnetometer data
 * Returns angle in degrees (0-360)
 */
float calculateHeading(float magX, float magY) {
  float heading = atan2(magY, magX) * 180.0 / PI;
  if (heading < 0) {
    heading += 360.0;
  }
  return heading;
}

/**
 * Calculate altitude from pressure using barometric formula
 * seaLevelPressure: Reference pressure at sea level in Pa (default 101325)
 */
float calculateAltitude(float pressure, float seaLevelPressure) {
  return 44330.0 * (1.0 - pow(pressure / seaLevelPressure, 1.0 / 5.255));
}

/**
 * Test function: Read sensor values and display on OLED
 * Continues until button SW1 (pin TEST_BUTTON_PIN) is pressed
 */
void runGyroTest() {
  Serial.println("Starting GY-91 Test...");
  Serial.println("Displaying sensor data on OLED. Press SW1 button to exit.");
  
  // NOTE: Do NOT call initOLED() or initializeGyro() again!
  // These are already initialized in main.cpp.
  // Re-initializing can corrupt the I2C bus.
  // Just read the sensors and display data.
  
  SensorData_t sensorData;
  char displayBuffer[256];
  uint32_t lastDisplayTime = 0;
  const uint32_t DISPLAY_UPDATE_INTERVAL = 100;  // Update every 100 ms
  
  // Clear OLED
  clearOled();
  delay(200);
  
  // Test loop - continues until SW1 button is pressed
  while (digitalRead(TEST_BUTTON_PIN) == HIGH) {
    // Read sensor data
    readGyroData(&sensorData);
    
    // Print to serial for debugging
    printSensorData(&sensorData);
    
    // Update OLED display periodically
    uint32_t currentTime = millis();
    if (currentTime - lastDisplayTime >= DISPLAY_UPDATE_INTERVAL) {
      lastDisplayTime = currentTime;

      // build a multi-line summary of all important sensor values
      snprintf(displayBuffer, sizeof(displayBuffer),
               "AX:%4.1f AY:%4.1f\n"
               "AZ:%4.1f\n"
               "GX:%4.1f GY:%4.1f\n"
               "GZ:%4.1f\n"
               "T:%.1fC P:%.0fhPa\n"
               "Alt:%.1fm",
               sensorData.accelX, sensorData.accelY,
               sensorData.accelZ,
               sensorData.gyroX, sensorData.gyroY,
               sensorData.gyroZ,
               sensorData.temperature,
               sensorData.pressure / 100.0,
               sensorData.altitude);

      writeToOled(displayBuffer);
    }
    
    // small delay to debounce button and avoid busy loop
    delay(10);
  }
  
  // Button pressed - exit test
  Serial.println("SW1 pressed - exiting GY-91 test");
  clearOled();
  writeToOled("Test exited");
  delay(500);
  clearOled();
}
