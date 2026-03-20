#include "dcmotor.h"
#include "LEDMatrix.h"
#include "buttons.h"

void initDCMotors() {
  pinMode(MOTOR1_IN1_PIN, OUTPUT);
  pinMode(MOTOR1_IN2_PIN, OUTPUT);
 
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
  for (int i = 1; i <= 4; i++) {
    setDCSpeed(i, FORWARD, 0);
  }

  pinMode(SW1_PIN, INPUT_PULLUP);
  pinMode(SW2_PIN, INPUT_PULLUP);
  pinMode(SW3_PIN, INPUT_PULLUP);
  pinMode(SW4_PIN, INPUT_PULLUP);

  turnOffLEDMatrix();

  int currentMotor = 1;
  setLEDMatrixPixel(currentMotor - 1, 255, 255, 255);
  showLEDMatrix();
  int speed = 0;
  int direction = FORWARD;

  int prevMotor = currentMotor;
  int prevSpeed = speed;
  int prevDir = direction;

  bool running = true;
  while (running) {
    if (digitalRead(SW1_PIN) == LOW) {
      currentMotor = (currentMotor % 4) + 1;
      turnOffLEDMatrix();
      setLEDMatrixPixel(currentMotor - 1, 255, 255, 255);
      showLEDMatrix();
      delay(200);
    }

    if (digitalRead(SW2_PIN) == LOW) {
      speed += 10;
      if (speed > 100) speed = 0;
      setDCSpeed(currentMotor, direction, speed);
      delay(200);
    }

    if (digitalRead(SW3_PIN) == LOW) {
      direction = (direction == FORWARD) ? BACKWARD : FORWARD;
      setDCSpeed(currentMotor, direction, speed);
      delay(200);
    }

    if (digitalRead(SW4_PIN) == LOW) {
      running = false;
      delay(200);
    }

    if (currentMotor != prevMotor || speed != prevSpeed || direction != prevDir) {
      prevMotor = currentMotor;
      prevSpeed = speed;
      prevDir = direction;
    }

    int brightness = map(speed, 0, 100, 0, 255);
    for (int i = 0; i < 4; i++) {
      if (i + 1 == currentMotor) {
        if (direction == FORWARD) {
          setLEDMatrixPixel(4 + i, 0, brightness, 0);
        } else {
          setLEDMatrixPixel(4 + i, brightness, 0, 0);
        }
      } else {
        setLEDMatrixPixel(4 + i, 0, 0, 0);
      }
    }
    showLEDMatrix();

    delay(50);
  }

  for (int i = 1; i <= 4; i++) {
    setDCSpeed(i, FORWARD, 0);
  }
  turnOffLEDMatrix();
}
