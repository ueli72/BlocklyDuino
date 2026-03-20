#include "servos.h"
#include "LEDMatrix.h"
#include <ESP32Servo.h>

Servo servo1;
Servo servo2;
Servo servo3;

void initializeServos() {
  servo1.attach(SERVO1_PIN);
  servo2.attach(SERVO2_PIN);
  servo3.attach(SERVO3_PIN);
}

void setServoAngle(int servoNum, int angle) {
  if (angle < 0) angle = 0;
  if (angle > 180) angle = 180;

  switch (servoNum) {
    case 1:
      servo1.write(angle);
      break;
    case 2:
      servo2.write(angle);
      break;
    case 3:
      servo3.write(angle);
      break;
    default:
      break;
  }
}

void testServoSweep(int servoNum) {
  for (int angle = 0; angle <= 180; angle++) {
    setServoAngle(servoNum, angle);
    delay(10);
  }
  for (int angle = 180; angle >= 0; angle--) {
    setServoAngle(servoNum, angle);
    delay(10);
  }
}

void testServos() {
  initializeServos();
  turnOffLEDMatrix();

  for (int i = 1; i <= NUM_SERVOS; i++) {
    setLEDMatrixPixel(i - 1, 255, 255, 255);
    showLEDMatrix();

    for (int angle = 0; angle <= 180; angle++) {
      setServoAngle(i, angle);
      delay(10);
    }

    setServoAngle(i, 0);
    delay(500);

    turnOffLEDMatrix();
  }
}
