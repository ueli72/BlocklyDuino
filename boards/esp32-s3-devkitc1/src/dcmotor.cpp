#include "dcmotor.h"
#include "LEDMatrix.h"
#include "buttons.h"

void initDCMotors() {
  pinMode(MOTOR1_IN1_PIN, OUTPUT);
  pinMode(MOTOR1_IN2_PIN, OUTPUT);
  pinMode(MOTOR2_IN1_PIN, OUTPUT);
  pinMode(MOTOR2_IN2_PIN, OUTPUT);
 
  pinMode(MOTOR3_IN1_PIN, OUTPUT);
  pinMode(MOTOR3_IN2_PIN, OUTPUT);
  pinMode(MOTOR4_IN1_PIN, OUTPUT);
  pinMode(MOTOR4_IN2_PIN, OUTPUT);

  analogWriteFrequency(500);
}

void setDCSpeed(int motorNum, int direction, int speedPercent) {
  int in1Pin, in2Pin;

  switch (motorNum) {
    case 1:
      in1Pin = MOTOR1_IN1_PIN;
      in2Pin = MOTOR1_IN2_PIN;
      break;
    case 2:
      in1Pin = MOTOR2_IN1_PIN;
      in2Pin = MOTOR2_IN2_PIN;
      break;
    case 3:
      in1Pin = MOTOR3_IN1_PIN;
      in2Pin = MOTOR3_IN2_PIN;
      break;
    case 4:
      in1Pin = MOTOR4_IN1_PIN;
      in2Pin = MOTOR4_IN2_PIN;
      break;
    default:
      return;
  }

  int pwmValue = map(speedPercent, 0, 100, 0, 255);
  
  if (speedPercent <= 0) {
    analogWrite(in1Pin, 0);
    analogWrite(in2Pin, 0);
    digitalWrite(in1Pin, LOW);
    digitalWrite(in2Pin, LOW);
  } else {
    if (direction == FORWARD) {
      analogWrite(in1Pin, pwmValue);
      analogWrite(in2Pin, 0);
      digitalWrite(in2Pin, LOW);
    } else {
      analogWrite(in1Pin, 0);
      digitalWrite(in1Pin, LOW);
      analogWrite(in2Pin, pwmValue);
    }
  }
}

void testDCMotors() {

    setDCSpeed(1, FORWARD, 100);
    delay(1000);
    setDCSpeed(1, FORWARD, 0);
    delay(500);
    setDCSpeed(1, BACKWARD, 100);
    delay(1000);
    setDCSpeed(1, BACKWARD, 0);
    delay(500);
    
    setDCSpeed(2, FORWARD, 100);
    delay(1000);
    setDCSpeed(2, FORWARD, 0);
    delay(500);
    setDCSpeed(2, BACKWARD, 100);
    delay(1000);
    setDCSpeed(2, BACKWARD, 0);
    delay(500);

    setDCSpeed(3, FORWARD, 100);
    delay(1000);
    setDCSpeed(3, FORWARD, 0);
    delay(500);
    setDCSpeed(3, BACKWARD, 100);
    delay(1000);
    setDCSpeed(3, BACKWARD, 0);
    delay(500);

    setDCSpeed(4, FORWARD, 100);
    delay(1000);
    setDCSpeed(4, FORWARD, 0);
    delay(500);
    setDCSpeed(4, BACKWARD, 100);
    delay(1000);
    setDCSpeed(4, BACKWARD, 0);
    delay(500);

}

