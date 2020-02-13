# Developer Documentation
## Necessary Hardware
- 1 Particle Photon
- 3 LEDs
- 1 Piezo Buzzer
- 1 PIR Sensor
## AlarmBox.ino
### Before Setup
- Pins are defined with int variables for easy changing of pins
- Publish flags initialized
- Necessary delta timing variables initialized
### Setup
- Particle functions set up with Particle.function
- Pins set up with pinMode
= Unarmed LED written to HIGH 
### Loop
- Calls publishState and publishTriggered if corresponding flags set to true
- Uses delta timing to check and update whether the PIR sensor detected motion every second
- When alarm is triggered, uses delta timing if the buzzer should sound again.
- Set alarmTriggered to true if motionDetected and alarmState are true.
- If motionDetected or alarmState have changed, set publishStateFlag to true.
### Particle Functions
```
publishState(String x)
```
- Publishes the current state of the Alarm Box. The current state includes values of the following variables:
  - motionDetected: a boolean variable set to true if the PIR sensor detected motion
  - alarmState: a boolean variable set to true if the alarm was armed from the ui
  - alarmTriggered: a boolean variable set to true if the alarm was triggered
- Note: parameter x does nothing
```
publishTriggered(String x)
```
- Publishes the value of alarmTriggered.
- Only publishes when the alarm was triggered.
- Note: parameter x does nothing
```
setAlarm(String x)
```
- Sets alarmState to true if parameter x is "true" or "on" (not case sensitive)
- Sets alarmState to false if parameter x is "false" or "off" (not case sensitive)
- publishState("") is called is alarmState changes value
```
setFrequency(String x)
```
- Sets the frequency of the sound the piezo buzzer makes when triggered
- Only accepts values between 2000 and 20000 (in Hz)
```
setDuration(String x)
```
- Sets how long each individual beep lasts when triggered
- Only accepts values between 50 and 200 (in ms)

### UI functions 

#### AlarmBoxApp.js -> Displays the actual UI
```
document.addEventListener("DOMContentLoaded", function(event)
```
- When page is loaded, initializes HTML elements needed to be manipulated by the JS code
- NOTE: do NOT mess with any of the code beneath this event listener or any code in app.js, as that all is server code used to run the Auth0 server, not needed to change web app functionality


```
stateUpdate(newState)
```
- Updates the state of the UI according to received state from the Photon hardware and adjusts UI display accordingly, turning on switches, adjusting slider information, and displaying protection status

```
autoHide()
```
- Hides all pages besides the one the user is currently seeing through a tracker variable

```
logUpdate()
```
- Takes user to login page and hides all other pages

```
signUpdate()
```
- Takes user to signup page and hides all other pages

```
stUpdate()
```
- Takes user to the alarm status page and hides all other pages

```
alarmed(event)
```
- When called via an event listener (touching the switch label), sets the state of the alarm switch and sends it to the hardware

```
freqchange(event)
```
- When called via an event listener (changing the frequency slider), sets the frequency of the Piezo buzzer and sends it to the hardware


```
durchange(event)
```
- When called via an event listener (changing the duration slider), sets the duration of the Piezo buzzer beeps and sends it to the hardware


#### AlarmBox.js -> Works as intermiary between UI (AlarmBoxApp.js) and Photon alarm hardware (alarmbox.ino)

```
newBoxEvent(objectContainingData)
```
- When subscribed to the event stream that the Photn hardware publishes to, this function will intercept the object data sent and parse it through to take each individual variable out, and then it sends it to statechange(), which calls stateupdate(newstate)

```
setup()
```
- Sets up a connection to the Particle Photon hardware and subscribes to the channel that the Photon hardware publishes to

```
setState: function(AlarmStat)
```
- Sends value of AlarmStat to the Partcle Photon hardware as the state of the alarm


```
setFrequency: function(frequent)
```
- Sends value of frequent to the Partcle Photon hardware as the frequency of the Piezo buzzer


```
setDuration: function(dur)
```
- Sends value of dur to the Partcle Photon hardware as the duration of the Piezo buzzer's beeping cycle

```
setStateChangeListener: function(aListener)
```
- Connects intermediary Javascipt to AlarmBoxApp.js, the main UI JS file. aListener is the function stateUpdate, which is called by stateChange()

```
stateChange()
```
- sends current state of the Photon hardware to the UI in AlarmBoxApp.js via the creation of a JSON object
- States have values of:
 - alarmState: Is the alarm activated? true or false value
 - motionDetected: true if motion was detected, false if not
 - alarmTriggered: has the alarm been triggered?
 - frequency: frequency of the Piezo buzzer
 - durationL duration of the Piezo buzzer beep cycle

#### index.html

- Page content under "main-content" div
- Main divs: login page with login button, a sign up page which has no real functionality right now, and a status page for the alarm system
