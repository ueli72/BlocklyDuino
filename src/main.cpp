// 注意：伺服馬達需要PWM（脈衝寬度調變）輸出腳位

#include <Arduino.h>
#include <Servo.h>

Servo myServo;

void setup() {
  myServo.attach(-1);
}

void loop() {
}
