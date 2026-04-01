// Made for playground-brumbrum-esp32-s3-devkitc1
#include "dcmotor.h"
#include "serial.h"
#include "buttons.h"

static bool serialInitialized = false;

static void ensureSerialInit() {
    if (!serialInitialized) {
        initSerial(115200);
        serialInitialized = true;
        serialPrintln("\n[DC Motor] Serial initialized");
    }
}

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
    ensureSerialInit();
    
    serialPrintln("\n========================================");
    serialPrintln("         DC MOTOR TEST");
    serialPrintln("========================================");
    
    if (mask & 1) {
        serialPrintln("[Motor 1] Forward...");
        setDCSpeed(1, FORWARD, 100);
        delay(1000);
        serialPrintln("[Motor 1] Stop");
        setDCSpeed(1, FORWARD, 0);
        delay(500);
        serialPrintln("[Motor 1] Backward...");
        setDCSpeed(1, BACKWARD, 100);
        delay(1000);
        serialPrintln("[Motor 1] Stop");
        setDCSpeed(1, BACKWARD, 0);
        delay(500);
    }
    
    if (mask & 2) {
        serialPrintln("[Motor 2] Forward...");
        setDCSpeed(2, FORWARD, 100);
        delay(1000);
        serialPrintln("[Motor 2] Stop");
        setDCSpeed(2, FORWARD, 0);
        delay(500);
        serialPrintln("[Motor 2] Backward...");
        setDCSpeed(2, BACKWARD, 100);
        delay(1000);
        serialPrintln("[Motor 2] Stop");
        setDCSpeed(2, BACKWARD, 0);
        delay(500);
    }

    if (mask & 4) {
        serialPrintln("[Motor 3] Forward...");
        setDCSpeed(3, FORWARD, 100);
        delay(1000);
        serialPrintln("[Motor 3] Stop");
        setDCSpeed(3, FORWARD, 0);
        delay(500);
        serialPrintln("[Motor 3] Backward...");
        setDCSpeed(3, BACKWARD, 100);
        delay(1000);
        serialPrintln("[Motor 3] Stop");
        setDCSpeed(3, BACKWARD, 0);
        delay(500);
    }

    if (mask & 8) {
        serialPrintln("[Motor 4] Forward...");
        setDCSpeed(4, FORWARD, 100);
        delay(1000);
        serialPrintln("[Motor 4] Stop");
        setDCSpeed(4, FORWARD, 0);
        delay(500);
        serialPrintln("[Motor 4] Backward...");
        setDCSpeed(4, BACKWARD, 100);
        delay(1000);
        serialPrintln("[Motor 4] Stop");
        setDCSpeed(4, BACKWARD, 0);
        delay(500);
    }

    serialPrintln("========================================");
    serialPrintln("      DC Motor test complete!");
    serialPrintln("========================================");
}
