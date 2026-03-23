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
  
  char buffer[80];
  
  for (int i = 0; i < 20; i++) {
    float distFront = measureDistance(SENSOR_FRONT);
    float distBack = measureDistance(SENSOR_BACK);
    snprintf(buffer, sizeof(buffer), "! 5V external !\n%d/20\nFront: %.1f cm\nBack: %.1f cm", i + 1, distFront, distBack);
    writeToOled(buffer);
    delay(200);
  }
  
  clearOled();
}
