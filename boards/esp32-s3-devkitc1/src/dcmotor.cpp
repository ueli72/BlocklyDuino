#include "dcmotor.h"
#include "LEDMatrix.h"
#include "buttons.h"

// Function to initialize DC motor pins
void initDCMotors() {
  pinMode(MOTOR1_IN1_PIN, OUTPUT);
  pinMode(MOTOR1_IN2_PIN, OUTPUT);
 
 // pinMode(MOTOR2_IN1_PIN, OUTPUT);
 // pinMode(MOTOR2_IN2_PIN, OUTPUT);
 
  pinMode(MOTOR3_IN1_PIN, OUTPUT);
  pinMode(MOTOR3_IN2_PIN, OUTPUT);
  pinMode(MOTOR4_IN1_PIN, OUTPUT);
  pinMode(MOTOR4_IN2_PIN, OUTPUT);

  // Set PWM frequency to 20 kHz for smoother motor operation (global for all channels)
  analogWriteFrequency(500);
}

// Function to set DC motor speed and direction
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
      return; // Invalid motor
  }

  // ensure pins are outputs (initDCMotors should have been called)
  // speedPercent 0 = standby (both LOW)
  int pwmValue = map(speedPercent, 0, 100, 0, 255);
  
  if (speedPercent <= 0) {
    analogWrite(in1Pin, 0);
    analogWrite(in2Pin, 0);
    digitalWrite(in1Pin, LOW);
    digitalWrite(in2Pin, LOW);
  } else {
    if (direction == FORWARD) {
      analogWrite(in1Pin, pwmValue); // PWM on IN1
      analogWrite(in2Pin, 0); // IN2 LOW
      digitalWrite(in2Pin, LOW);
    } else { // BACKWARD
      analogWrite(in1Pin, 0); // IN1 LOW
      digitalWrite(in1Pin, LOW);

      analogWrite(in2Pin, pwmValue);
    }
  }

  // debug info
  Serial.print("setDCSpeed motor ");
  Serial.print(motorNum);
  Serial.print(" dir ");
  Serial.print(direction == FORWARD ? "F" : "B");
  Serial.print(" speed ");
  Serial.print(speedPercent);
  Serial.print("% PWM ");
  Serial.println(pwmValue);
}

// Test function for DC motors
void testDCMotors() {
  // Initialize all motors to stop
  for (int i = 1; i <= 4; i++) {
    setDCSpeed(i, FORWARD, 0);
  }

  // Configure button pins
  pinMode(SW1_PIN, INPUT_PULLUP);
  pinMode(SW2_PIN, INPUT_PULLUP);
  pinMode(SW3_PIN, INPUT_PULLUP);
  pinMode(SW4_PIN, INPUT_PULLUP);

  // Turn off all LEDs
  turnOffLEDMatrix();

  int currentMotor = 1;
  setLEDMatrixPixel(currentMotor - 1, 255, 255, 255); // LED1 for motor1, etc.
  showLEDMatrix();
  int speed = 0;
  int direction = FORWARD;

  // debug tracking variables
  int prevMotor = currentMotor;
  int prevSpeed = speed;
  int prevDir = direction;

  Serial.println("DC Motor Test Started");
  Serial.println("SW1: Select motor (1-4)");
  Serial.println("SW2: Increase speed by 10% (0-100%)");
  Serial.println("SW3: Change direction");
  Serial.println("SW4: End test");
  Serial.println("LED1-4: Indicate selected motor");
  Serial.println("LED5-8: Motor status (green forward, red backward, brightness=speed)");

  bool running = true;
  while (running) {
    // Handle SW1: Select motor
    if (digitalRead(SW1_PIN) == LOW) {
      currentMotor = (currentMotor % 4) + 1;
      // Set selection LEDs
      turnOffLEDMatrix();
      setLEDMatrixPixel(currentMotor - 1, 255, 255, 255); // LED1 for motor1, etc.
      showLEDMatrix();
      Serial.print("Selected motor: ");
      Serial.println(currentMotor);
      delay(200); // Debounce
    }

    // Handle SW2: Increase speed
    if (digitalRead(SW2_PIN) == LOW) {
      speed += 10;
      if (speed > 100) speed = 0;
      setDCSpeed(currentMotor, direction, speed);
      Serial.print("Motor ");
      Serial.print(currentMotor);
      Serial.print(" speed: ");
      Serial.print(speed);
      Serial.println("%");
      delay(200); // Debounce
    }

    // Handle SW3: Change direction
    if (digitalRead(SW3_PIN) == LOW) {
      direction = (direction == FORWARD) ? BACKWARD : FORWARD;
      setDCSpeed(currentMotor, direction, speed);
      Serial.print("Motor ");
      Serial.print(currentMotor);
      Serial.print(" direction: ");
      Serial.println(direction == FORWARD ? "FORWARD" : "BACKWARD");
      Serial.print(" speed: ");
      Serial.print(speed);
      delay(200); // Debounce
    }

    // Handle SW4: End test
    if (digitalRead(SW4_PIN) == LOW) {
      Serial.println("DC Motor test ended");
      running = false;
      delay(200); // Debounce
    }

    // debug info: print whenever state changes
    if (currentMotor != prevMotor || speed != prevSpeed || direction != prevDir) {
      Serial.print("Status -> Motor:");
      Serial.print(currentMotor);
      Serial.print(" Speed:");
      Serial.print(speed);
      Serial.print(" Dir:");
      Serial.println(direction == FORWARD ? "FORWARD" : "BACKWARD");
      prevMotor = currentMotor;
      prevSpeed = speed;
      prevDir = direction;
    }

    // Update status LEDs for all motors (assuming all motors have same speed/direction for simplicity, or track per motor)
    // For simplicity, only update the current motor's LED, others off
    // But according to spec, LED5 for motor1, etc.
    // Since speed and direction are per currentMotor, set only that LED
    
    int brightness = map(speed, 0, 100, 0, 255);
    for (int i = 0; i < 4; i++) {
      if (i + 1 == currentMotor) {
        if (direction == FORWARD) {
          setLEDMatrixPixel(4 + i, 0, brightness, 0); // Green for forward
        } else {
          setLEDMatrixPixel(4 + i, brightness, 0, 0); // Red for backward
        }
      } else {
        setLEDMatrixPixel(4 + i, 0, 0, 0); // Off
      }
    }
    showLEDMatrix();

    delay(50); // Small delay
  }

  // Stop all motors
  for (int i = 1; i <= 4; i++) {
    setDCSpeed(i, FORWARD, 0);
  }
  turnOffLEDMatrix();
}