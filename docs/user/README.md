# Alarm Box
Alarm Box created by Rohan Rai and Julio Trujillo
## Motivation
The Alarm Box was our final project for our Internet of Things course.
The features in the project were inspired by concepts from this course.
This system was created by a desire to have a constant monitor on valuables locked in a container with the ability to alert a user if the container was tampered with and opened.

## How does it work?
With the power of the particle photon and a user interface, users can arm or disarm the box from the ui.
The PIR sensor is checking for motion every second (i.e. the box is openned).
The piezo buzzer sounds if the PIR sensor detected motion and the box was armed. The frequency and duration of the buzzing can be set via the UI as well.

## What do the LEDs mean?
The green LED is on when the alarm is unarmed.
The first red LED is on when the alarm is armed.
The second red LED is on when the PIR sensor detects motion.

## Setting up the UI
The UI is run on a node.js server, so you will need to install node.js onto your computer and be abe to use the npm command. Once you are able to do so, go to the downloaded ui folder and run in the terminal "npm start". This will start the server on localhost, port 3000. To access the UI, simply type in localhost:3000 into your browserURL.

## Using the UI
Now, you will be taken to the home screen. In order to log in, simply click the "Monitor" button or the "Login" buttons. This will take you to the Auth0 login screen. Sign up with a new account. If you cannot access the app via loggin in, contact your provider and get them to whitelist you on their Auth0 server. However, you should be able to immediately log in after signing up for an account. You will be taken to the main status screen for the alarm. You can log out by pressing the "Logout" button at the bottom of the screen. You can go to your account picture in the top right corner and view your accoutn details as well; to go back to the alarm status screen by pressing the "Home" label in the navigation bar. NOTE: Do not arm the box while the motion detected LED is on.

## Alarm Functionality
From the UI, you can click the Alarm State switch to turn the alarm on or off. You may also adjust the frequency and duration of the Piezzo beeper by moving the values of the Frequency and Duration sliders. When the alarm state is on and the hardware is still enclosed in the container, the status should show up as "Protected". When the alarm state is on and the container is opened, the beeper will go off, and the UI will display "NOT PROTECTED". The only way to stop the beeping is to tuen the alarm state off. Additonally, if you have an IFTTT account, you can register your Facebook account with the product to have notifications sent to your Facebook messebger whenever the alarm is triggered.
