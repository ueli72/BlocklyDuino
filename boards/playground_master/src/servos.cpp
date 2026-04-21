// Made for playground_master
#include "servos.h"
#include "oled.h"

Servo servo1;
Servo servo2;
Servo servo3;

void initializeServo(int servoNum, int pin) {
  switch (servoNum) {
    case 1:
      if (!servo1.attached()) {
        servo1.attach(pin);
      }
      break;
    case 2:
      if (!servo2.attached()) {
        servo2.attach(pin);
      }
      break;
    case 3:
      if (!servo3.attached()) {
        servo3.attach(pin);
      }
      break;
    default:
      break;
  }
}

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

  for (int i = 1; i <= NUM_SERVOS; i++) {
    writeToOled("Servo %d\nSweep 0-180", i);

    for (int angle = 0; angle <= 180; angle++) {
      setServoAngle(i, angle);
      delay(10);
    }

    setServoAngle(i, 0);
    delay(500);
  }
  clearOled();
}
