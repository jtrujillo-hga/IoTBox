# 1. Description

While in college, have you ever had that one roommate that would always steal food from your mini-fridge? Or have you ever wanted the peace of mind of knowing that your valuable objects are safe without having to physically check them? Then our alarm box is the solution for you! It protects the user’s valuable objects from being stolen. The system utilizes a motion sensor such that when it detects motion from the box being opened. The user can use their IFTTT mobile app to receive notifications based on the state of the box. If the box opens during its armed state, the device will emit a beeping sound through a beeper to scare off intruders and thieves, and a notification will be sent to the user’s IFTTT app. This product is intended for those who want to store their valuables in a specific location and later be able to come back to it knowing that it has not been tampered with (else there would be a notification on the user’s IFTTT app). The use of IoT is beneficial because without it there would be no way to remotely check whether your objects are safe in your box unless you physically check them. Also, there would be no way to set or disarm the alarm system without triggering the alarm itself (as the system is within the box) or to receive notifications if the box had been opened without some sort of networking system relaying information between devices. The benefits of the project outweigh the costs as being able to confirm the state of your valuables and manually arm and disarm the system from anywhere in the world is a boon that not many other systems can afford to offer at a cheap price. In short, our system offers features and services not provided by the majority of competing products while still being cheap and affordable, not to mention customizable with the ability to integrate more embedded devices into the system for added functionality. 


# 2. Hardware and Cloud Infrastructure Needed

## Hardware:
- 2 LEDs: Show state of the alarm box
- Beeper: Sounds when alarm goes off
- PIR Sensor: Detects whether an alarm went off.

## Cloud Infrastructure:
- IFTTT Notifications or SMS Service
- UI Connectivity
- Particle functions (publish/subscribe method)

# 3. Unknowns and Challenges
- Unsure how well PIR sensor will work
- Unsure of how to directly notify the user (via IFTTT notification or SMS)

# 4. User Stories & Usage Scenarios
- User can unarm/arm the device from the UI
- User can change the frequency of the beeper tone from the ui
- If the alarm goes off, the user can turn it off from the UI.
- The user is free to open the box if the box is in the unarmed state.
- User can choose to receive notifications on phone or not through webhook

User Stories:

- You're a TA for CSE 222 who needs to ensure that the mini-garage is secure and that no student tried to steal a mini-garage to test out their code outside of office hours. You place the alarm system inside the container for the mini-garage, load the UI on your device, and turn the alarm on. If a student tried to steal a garage by opening the container with the mini-garages, the motion sensor on the alarm sensor will detect that the container has been opeing, emitting a loud beeping sound and sending a notification either on your phone through text or in an app stating that the container has been tampered with. When office hours come around, you can disable the alarm system from the UI in order to peacefully take out the garage.

- Your suitemate keeps raiding your fridge for food and keeps denying that they're taking any of it. You set up the alarm system inside your fridge, set the alarm on when you're gone, and can get proof that they're stealing your food as you would get a notification on your phone if the motion sensor detects the fridge door opening while you are gone, meaning that you now have hard proof that your suitemate is stealing your food. 


# 5. Paper Prototypes

![Image of Prototype](https://github.com/wustl-cse222-fs19/project-projectplan_rai_trujillo/blob/master/docs/proposal/IMG_1154%20(1).jpg)

# 6. Implementation: Sequence Diagrams

![Sequence Diagram](https://github.com/wustl-cse222-fs19/project-projectplan_rai_trujillo/blob/master/docs/proposal/Rai_Trujillo_Project_sequence_diagram.jpg)

title Alarm Box
participant UI
participant Particle.io
participant Photon
participant IFTTT
UI -> Particle.io: Alarm set on
Particle.io -> Photon: Alarm state = on
Photon -> Photon: set LEDs
Photon -> Particle.io: Publish state
Particle.io -> UI: update state
Photon -> Particle.io: Motion detected (update state)
Photon -> Photon: set beeper
Particle.io -> UI: update state
Photon -> IFTTT: Send alarm notification
UI -> Particle.io: turn off alarm
Particle.io -> Photon: Alarm state = off
Photon -> Photon: set LEDs
Photon -> Particle.io: Publish state
Particle.io -> UI: update state

# 7. Plan and Schedule

## Weekly Schedule / Progress

| Week End     | Deliverables & Accomplishments |
|:-------------|:-------------------------------|
| By Nov 16    |UI skeleton and embedded state machine written      |
| By Nov. 23   |UI and embedded send/update box state to each other |
| By Nov. 30   |IFTTT implemented with the device                   |
| Dec. 3       |  Complete Project Due!         |

## Group Member Responsibilities (Groups only)

| Name         | Responsibilities |
|:-------------|:-----------------|
|Julio Trujillo|Embedded code     |
|Rohan Rai     |UI Code           |

## Times Reserved for Project Work

Fill in a schedule of times reserved for the project.  If you can't set regular weekly times, create a schedule based on specific days.

| Week Day | Times | Who (if on a team) |
|:---------|:------|--------------------|
| Monday   |       |                    |
| Tuesday  |4-6PM  |Both                |
| Wednesday|       |                    |
| Thursday |       |                    |
| Friday   |1-5PM  |Both                |
| Saturday |2-5PM  |Both                |
| Sunday   |       |                    |

# 8. Bonus

Notifications through SMS via a webhook, allowing the user to not have to keep the IFFTT app on their phone in order to receive notifications if the alram system detects tampering with the container it is in. We have to learn how to integrate webhooks with phone numbers, something we did not do in the mini-studio (we only used notifications through the IFFTT app), which will require further research on the code necessary to implement this functionality, which is important as not everyone wants to install an app that takes up space on their phone and create a new account to connect to and use a new product.

We also want to experiment with the PIR motion sensor more than we did in Studio 11 as we want to see if we could potentially set the motion sensor to detect changes in infared light instead of purely motion-based movement, which means that the sensor would react based on if the container is opened and exposed to a change in outside light while the system is armed instead of reading the motion of the door opening, meaning that the user could more easily transfer the container while the alarm is on and not worry about accidentally triggering a false positive in the motion-based security system. This requires more in-depth research on the properties and outputs of the PIR sensor.  
