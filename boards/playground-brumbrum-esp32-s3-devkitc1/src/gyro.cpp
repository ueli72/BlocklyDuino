#include "gyro.h"
#include "oled.h"
#include "buttons.h"
#include "mpu6500_raw.h"

Adafruit_BMP280 bmp280;

static float seaLevelPressure = 101325.0;

void initializeGyro() {
  Wire.end();
  delay(100);
  Wire.begin(8, 9);
  Wire.setClock(400000);
  delay(500);
  
  Wire.beginTransmission(0x68);
  uint8_t error = Wire.endTransmission();
  
  mpu6500_init();
  
  bmp280.begin(BMP280_ADDR);
  bmp280.setSampling(Adafruit_BMP280::MODE_NORMAL,
                     Adafruit_BMP280::SAMPLING_X2,
                     Adafruit_BMP280::SAMPLING_X16,
                     Adafruit_BMP280::FILTER_X16,
                     Adafruit_BMP280::STANDBY_MS_500);
  
  pinMode(TEST_BUTTON_PIN, INPUT_PULLUP);
  delay(500);
}

void readGyroData(SensorData_t* data) {
  if (data == NULL) return;
  
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
  
  data->magX = 0;
  data->magY = 0;
  data->magZ = 0;
  data->heading = fmod(fabs(data->gyroZ), 360.0);
  
  float bmp_temp = bmp280.readTemperature();
  float press = bmp280.readPressure();
  float alt = bmp280.readAltitude(seaLevelPressure);
  
  if (bmp_temp > -50 && bmp_temp < 150) {
    data->temperature = bmp_temp;
    data->bmp_temperature = bmp_temp;
  }
  
  if (press > 30000 && press < 120000) {
    data->pressure = press;
  }
  
  if (!isnan(alt) && alt > -1000 && alt < 10000) {
    data->altitude = alt;
  }
}

void printSensorData(const SensorData_t* data) {
  if (data == NULL) return;
}

float calculateHeading(float magX, float magY) {
  float heading = atan2(magY, magX) * 180.0 / PI;
  if (heading < 0) {
    heading += 360.0;
  }
  return heading;
}

float calculateAltitude(float pressure, float seaLevelPressure) {
  return 44330.0 * (1.0 - pow(pressure / seaLevelPressure, 1.0 / 5.255));
}

void runGyroTest() {
  SensorData_t sensorData;
  char displayBuffer[256];
  uint32_t lastDisplayTime = 0;
  const uint32_t DISPLAY_UPDATE_INTERVAL = 100;
  
  clearOled();
  delay(200);
  
  while (digitalRead(TEST_BUTTON_PIN) == HIGH) {
    readGyroData(&sensorData);
    
    printSensorData(&sensorData);
    
    uint32_t currentTime = millis();
    if (currentTime - lastDisplayTime >= DISPLAY_UPDATE_INTERVAL) {
      lastDisplayTime = currentTime;

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
    
    delay(10);
  }
  
  clearOled();
  writeToOled("Test exited");
  delay(500);
  clearOled();
}
