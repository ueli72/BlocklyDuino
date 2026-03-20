#include "ultrasonic.h"
#include "oled.h"

float measureDistance(int sensor) {
  int trigPin, echoPin;

  if (sensor == SENSOR_FRONT) {
    trigPin = FRONT_TRIG_PIN;
    echoPin = FRONT_ECHO_PIN;
  } else if (sensor == SENSOR_BACK) {
    trigPin = BACK_TRIG_PIN;
    echoPin = BACK_ECHO_PIN;
  } else {
    return -1;
  }

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH, 30000);
  float distance = duration / 58.0;

  return distance;
}

void testUltrasonicOLED() {
  initOLED();
  
  char buffer[64];
  
  writeToOled("Testing Front\nSensor");
  delay(2000);
  
  for (int i = 0; i < 50; i++) {
    float dist = measureDistance(SENSOR_FRONT);
    snprintf(buffer, sizeof(buffer), "Front: %.1f cm", dist);
    writeToOled(buffer);
    delay(200);
  }
  
  writeToOled("Testing Back\nSensor");
  delay(2000);
  
  for (int i = 0; i < 50; i++) {
    float dist = measureDistance(SENSOR_BACK);
    snprintf(buffer, sizeof(buffer), "Back: %.1f cm", dist);
    writeToOled(buffer);
    delay(200);
  }
  
  clearOled();
}
