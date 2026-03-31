#include "dcmotor.h"
#include "oled.h"
#include "buttons.h"

void initDCMotors(uint8_t mask) {
  if (mask & 1) {
    pinMode(MOTOR1_IN1_PIN, OUTPUT);
    pinMode(MOTOR1_IN2_PIN, OUTPUT);
  }
  if (mask & 2) {
    pinMode(MOTOR2_IN1_PIN, OUTPUT);
    pinMode(MOTOR2_IN2_PIN, OUTPUT);
  }
  if (mask & 4) {
    pinMode(MOTOR3_IN1_PIN, OUTPUT);
    pinMode(MOTOR3_IN2_PIN, OUTPUT);
  }
  if (mask & 8) {
    pinMode(MOTOR4_IN1_PIN, OUTPUT);
    pinMode(MOTOR4_IN2_PIN, OUTPUT);
  }

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

void testDCMotors(uint8_t mask) {
    if (mask & 1) {
        writeToOled("Motor 1\nForward");
        setDCSpeed(1, FORWARD, 100);
        delay(1000);
        writeToOled("Motor 1\nStop");
        setDCSpeed(1, FORWARD, 0);
        delay(500);
        writeToOled("Motor 1\nBackward");
        setDCSpeed(1, BACKWARD, 100);
        delay(1000);
        writeToOled("Motor 1\nStop");
        setDCSpeed(1, BACKWARD, 0);
        delay(500);
    }
    
    if (mask & 2) {
        writeToOled("Motor 2\nForward");
        setDCSpeed(2, FORWARD, 100);
        delay(1000);
        writeToOled("Motor 2\nStop");
        setDCSpeed(2, FORWARD, 0);
        delay(500);
        writeToOled("Motor 2\nBackward");
        setDCSpeed(2, BACKWARD, 100);
        delay(1000);
        writeToOled("Motor 2\nStop");
        setDCSpeed(2, BACKWARD, 0);
        delay(500);
    }

    if (mask & 4) {
        writeToOled("Motor 3\nForward");
        setDCSpeed(3, FORWARD, 100);
        delay(1000);
        writeToOled("Motor 3\nStop");
        setDCSpeed(3, FORWARD, 0);
        delay(500);
        writeToOled("Motor 3\nBackward");
        setDCSpeed(3, BACKWARD, 100);
        delay(1000);
        writeToOled("Motor 3\nStop");
        setDCSpeed(3, BACKWARD, 0);
        delay(500);
    }

    if (mask & 8) {
        writeToOled("Motor 4\nForward");
        setDCSpeed(4, FORWARD, 100);
        delay(1000);
        writeToOled("Motor 4\nStop");
        setDCSpeed(4, FORWARD, 0);
        delay(500);
        writeToOled("Motor 4\nBackward");
        setDCSpeed(4, BACKWARD, 100);
        delay(1000);
        writeToOled("Motor 4\nStop");
        setDCSpeed(4, BACKWARD, 0);
        delay(500);
    }

    clearOled();
}

