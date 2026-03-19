#include "ultrasonic.h"
#include "buttons.h"

// Function to measure distance for a specific sensor
float measureDistance(int sensor) {
  int trigPin, echoPin;

  if (sensor == SENSOR_FRONT) {
    trigPin = FRONT_TRIG_PIN;
    echoPin = FRONT_ECHO_PIN;
  } else if (sensor == SENSOR_BACK) {
    trigPin = BACK_TRIG_PIN;
    echoPin = BACK_ECHO_PIN;
  } else {
    return -1; // Invalid sensor
  }

  // Configure pins
  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  // Trigger the sensor
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  // Read the echo
  long duration = pulseIn(echoPin, HIGH, 30000); // Timeout 30ms

  // Calculate distance in cm
  float distance = duration / 58.0;

  return distance;
}

// Test function for ultrasonic sensors
void testUltrasonic() {
  // Configure button pins as INPUT_PULLUP (assuming from buttons.h)
  pinMode(SW1_PIN, INPUT_PULLUP);
  pinMode(SW2_PIN, INPUT_PULLUP);
  pinMode(SW3_PIN, INPUT_PULLUP);

  Serial.println("Ultrasonic Test Started");
  Serial.println("Press SW1 (GPIO1) to measure front sensor");
  Serial.println("Press SW2 (GPIO4) to measure back sensor");
  Serial.println("Press SW3 (GPIO3) to end test");

  bool running = true;
  while (running) {
    if (digitalRead(SW1_PIN) == LOW) {
      float dist = measureDistance(SENSOR_FRONT);
      Serial.print("Front sensor distance: ");
      Serial.print(dist);
      Serial.println(" cm");
      delay(500); // Debounce
    }

    if (digitalRead(SW2_PIN) == LOW) {
      float dist = measureDistance(SENSOR_BACK);
      Serial.print("Back sensor distance: ");
      Serial.print(dist);
      Serial.println(" cm");
      delay(500); // Debounce
    }

    if (digitalRead(SW3_PIN) == LOW) {
      Serial.println("Ultrasonic test ended");
      running = false;
      delay(500); // Debounce
    }

    delay(10); // Small delay
  }
}