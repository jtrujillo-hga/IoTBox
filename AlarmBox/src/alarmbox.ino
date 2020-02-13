STARTUP(WiFi.selectAntenna(ANT_AUTO));

int inputPin = D7;               // choose the PIR sensor pin
int ledPin = D6;                 // choose LED pin for motionDetected
int buzzerPin = D0;              // choose pin for buzzer
int armedPin = D4;               // choose LED pin to show that the box is armed
int unarmedPin = D3;             // choose LED pin to show that the box is unarmed

bool publishStateFlag = false;
bool publishTriggeredFlag = false;
bool ledState = false;
bool lastLedState = false;
bool motionDetected = false;
bool lastMotionDetected = false;
bool alarmState = false;
bool alarmTriggered = false;
bool soundState = false;
int frequency = 5000;
int duration = 150;

unsigned long nextCheck = 0;
unsigned long checkDelay = 50;
unsigned long nextSound = 0;
unsigned long soundDelay = 250;

void setup() {
  bool success = Particle.function("publishState", publishState);
  bool success2 = Particle.function("setAlarm", setAlarm);
  bool success3 = Particle.function("setFrequency", setFrequency);
  bool success4 = Particle.function("setDuration", setDuration);
  bool success5 = Particle.function("publishTriggered", publishTriggered);

  pinMode(ledPin, OUTPUT);       // set LED as output
  pinMode(inputPin, INPUT);      // set sensor as input
  pinMode(buzzerPin, OUTPUT);    // set buzzer as output
  pinMode(armedPin, OUTPUT);     // set Armed Led as output
  pinMode(unarmedPin, OUTPUT);   // set Unarmed Led as output
  digitalWrite(unarmedPin, HIGH);
}
void loop() {
  // publish the Box State
  if (publishStateFlag) {
    publishState("");
    publishStateFlag = false;
  }
  if (publishTriggeredFlag) {
    publishTriggered("");
    publishTriggeredFlag = false;
  }
  // Check if motion's been detected
  if (millis() > nextCheck) {
    lastLedState = digitalRead(ledPin);
    if (digitalRead(inputPin) == HIGH) {  // check if the input is HIGH
      digitalWrite(ledPin, HIGH);         // turn LED ON if high
      ledState = true;
      motionDetected = true;
    } else {
      digitalWrite(ledPin, LOW);          // turn LED OFF if no input
      ledState = false;
      motionDetected = false;
    }
    nextCheck = millis() + checkDelay;
  }
  // Toggle Alarm Sound if Alarm goes off
  if (millis() > nextSound) {
    if (alarmTriggered) {
      if (soundState) {
        noTone(buzzerPin);
        soundState = false;
      }
      else {
        tone(buzzerPin, frequency, duration);
        soundState = true;
      }
      nextSound = millis() + soundDelay;
    }
  }
  // Check if motion was detected when the alarm is set
  if (motionDetected && alarmState) {
    if (alarmTriggered == false) {
      nextSound = millis();
      //digitalWrite(buzzerPin, HIGH);
      soundState = true;
      tone(buzzerPin, frequency, duration);
      alarmTriggered = true;
      publishStateFlag = true;
      publishTriggeredFlag = true;
    }

  }
  // Check if publishStateFlag should be set to true
  if (lastLedState != ledState) {
    publishStateFlag = true;
    ledState = lastLedState;
  }
  if (lastMotionDetected != motionDetected) {
    publishStateFlag = true;
    lastMotionDetected = motionDetected;
  }
}

const String stateTopic = "cse222Box/thisBox/state";
// Particle function to publish the state of the box
int publishState(String x) {
  String data = "{";
  if (motionDetected) {
    data += "\"motionDetected\":true";
  } else {
    data += "\"motionDetected\":false";
  }
  data += ", ";
  if (alarmState) {
    data += "\"alarmState\":true";
  } else {
    data += "\"alarmState\":false";
  }
  data += ", ";
  if (alarmTriggered) {
    data += "\"alarmTriggered\":true";
  } else {
    data += "\"alarmTriggered\":false";
  }
  data += ", ";
  data += "\"frequency\": ";
  data += "\"";
  data += frequency;
  data += "\"";
  data += ", ";
  data += "\"duration\": ";
  data += "\"";
  data += duration;
  data += "\"";
  data += "}";
  //Serial.print("Publishing: ");
  //Serial.println(data);
  Particle.publish(stateTopic, data, 60, PRIVATE);
  return 0;
}

const String triggeredTopic = "csc222Box/thisBox/triggered";
// Particle function to publish data whether the alarm has been triggered
int publishTriggered(String x) {
  String data = "{";
  if (alarmTriggered) {

    data += "true";
  } else {
    data += "false";
  }
  data += "}";
  //Serial.print("Publishing: ");
  //Serial.println(data);
  Particle.publish(triggeredTopic, data);//, 60, PUBLIC);
  return 0;
}

// Particle function to set the alarm to armed or unarmed
int setAlarm(String x) {
  if (x.equalsIgnoreCase("on") || x.equalsIgnoreCase("true")) {
    bool temp = alarmState;
    alarmState = true;
    digitalWrite(armedPin, HIGH);
    digitalWrite(unarmedPin, LOW);
    if (temp != alarmState) {
      publishState("");
    }
    return 1;
  }
  else if (x.equalsIgnoreCase("off") || x.equalsIgnoreCase("false")) {
    bool temp = alarmState;
    alarmState = false;
    alarmTriggered = false;
    soundState = false;
    noTone(buzzerPin);
    digitalWrite(armedPin, LOW);
    digitalWrite(unarmedPin, HIGH);
    //digitalWrite(buzzerPin, LOW);
    if (temp != alarmState) {
      publishState("");
    }
    return 2;
  }
  else {
    return 0;
  }

}
// Particle Function to set the frequency of the buzzer sound
int setFrequency(String x) {
  if (x.toInt() >= 2000 && x.toInt() <= 20000) {
    frequency = x.toInt();
    publishStateFlag = true;
    return 1;
  }
  return 0;
}

// Particle Function to set the duration of each beep
int setDuration(String x) {
  if (x.toInt() >= 50 && x.toInt() <= 200) {
    duration = x.toInt();
    publishStateFlag = true;
    return 1;
  }
  return 0;
}
