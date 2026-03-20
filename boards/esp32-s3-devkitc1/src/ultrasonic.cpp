#include "ultrasonic.h"
#include "buttons.h"

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

void testUltrasonic() {
  pinMode(SW1_PIN, INPUT_PULLUP);
  pinMode(SW2_PIN, INPUT_PULLUP);
  pinMode(SW3_PIN, INPUT_PULLUP);

  bool running = true;
  while (running) {
    if (digitalRead(SW1_PIN) == LOW) {
      float dist = measureDistance(SENSOR_FRONT);
      delay(500);
    }

    if (digitalRead(SW2_PIN) == LOW) {
      float dist = measureDistance(SENSOR_BACK);
      delay(500);
    }

    if (digitalRead(SW3_PIN) == LOW) {
      running = false;
      delay(500);
    }

    delay(10);
  }
}
