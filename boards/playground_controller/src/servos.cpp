// Made for playground_controller
#include "servos.h"
#include "serial.h"
#include <ESP32Servo.h>

Servo servo1;
Servo servo2;
Servo servo3;

static bool serialInitialized = false;

static void ensureSerialInit() {
    if (!serialInitialized) {
        initSerial(115200);
        serialInitialized = true;
        serialPrintln("\n[Servos] Serial initialized");
    }
}

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
  ensureSerialInit();
  initializeServos();

  serialPrintln("\n========================================");
  serialPrintln("         SG90 SERVO TEST");
  serialPrintln("========================================");

  for (int i = 1; i <= NUM_SERVOS; i++) {
    serialPrint("[Servo ");
    serialPrint(i);
    serialPrintln("] Sweeping 0-180 degrees...");

    for (int angle = 0; angle <= 180; angle++) {
      setServoAngle(i, angle);
      delay(10);
    }

    setServoAngle(i, 0);
    delay(500);
    serialPrint("[Servo ");
    serialPrint(i);
    serialPrintln("] Sweep complete");
  }

  serialPrintln("========================================");
  serialPrintln("      Servo test complete!");
  serialPrintln("========================================");
}
