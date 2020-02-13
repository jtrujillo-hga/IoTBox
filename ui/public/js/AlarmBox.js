// Add the access token and device ID for connecting to Particle Photn
var myParticleAccessToken = "46bf8c25e244bb66b0389da231ca3b3c90d93ac8";
var myDeviceId =            "420037000447373336323230";
var topic =                 "cse222Box/thisBox/state";

function newBoxEvent(objectContainingData) { //checks for events published from Photon


  console.dir(objectContainingData.data)
  var myObj = JSON.parse(objectContainingData.data);
  box.alarmState = myObj.alarmState
  box.motiondetected = myObj.motiondetected
  box.alarmTriggered = myObj.alarmTriggered
  box.frequecy = myObj.frequency //parses JSON object
  box.duration = myObj.duration
  box.stateChange() //updates the UI
}


/* 
  Code for box object representing an alarm system controlled over Wi-Fi
  Features include:
     Ability to control frequency and duration of alarm beeper
     Ability to enable/disable alarm system
     Ability to monitor status of valuables protected by the alarm system
*/
var box = {
    // state variables for simulated alarm system
    alarmState: false,
    motiondetected: false,
    alarmTriggered: false,
    frequency: 5000,
    duration: 150,

    // Variable used to track listener function
    stateChangeListener: null,

    // NOTE: A new object to access particle JavaScript functions
    particle: null,

    // ****** Simple setter functions *******
    setState: function(AlarmStat) { //for setting alarm state
      this.alarmState = AlarmStat
    

      var functionData = {
        deviceId:myDeviceId,
        name: "setAlarm",
        argument: ""+this.alarmState,
        auth: myParticleAccessToken
      }

      // Include functions to provide details about the process.
      function onSuccess(e) { console.log("setAlarm call success") }
      function onFailure(e) { console.log("setAlarm call failed")
                             console.dir(e) }
      particle.callFunction(functionData).then(onSuccess,onFailure)
    },

    setFrequency: function(frequent) { //for frequency of the beeper
        this.frequency = frequent
        

        var functionData = { //JSON data for Photon
          deviceId:myDeviceId,
          name: "setFrequency",
          argument: ""+this.frequency,
          auth: myParticleAccessToken
        }

        // Include functions to provide details about the process.
        function onSuccess(e) { console.log("setFrequency call success") }
        function onFailure(e) { console.log("setFrequency failed")
                               console.dir(e) }
        particle.callFunction(functionData).then(onSuccess,onFailure) //calls Particle funciton with same name

      },

    setDuration: function(dur) { //for duration of the beeper in milliseconds
       this.duration = dur

      var functionData = {
          deviceId:myDeviceId,
          name: "setDuration",
          argument: ""+this.duration,
          auth: myParticleAccessToken
        }

        // Include functions to provide details about the process.
        function onSuccess(e) { console.log("setDuration call success") }
        function onFailure(e) { console.log("setDuration failed")
                               console.dir(e) }
        particle.callFunction(functionData).then(onSuccess,onFailure)
    },

    setStateChangeListener: function(aListener) { //for connecting intermediate JS to the JS for the UI
      this.stateChangeListener = aListener;
    },


    // stateChange is a utility function (helper function).
    // Consolidate all your code to update listeners here and then just call it.
    stateChange: function() {


      // Whenever this is called it should pass the current state to the callback function after 1s

      var callingObject = this
      
      // This code checks if callingObject.stateChangeListener is set to true so
      // it can then know if the state of the alarm system must be updated
      if(callingObject.stateChangeListener /*|| this.set*/) {
        // This creates a JSON style object.
        var state = { alarmState: this.alarmState,
          motiondetected: this.motiondetected,
          alarmTriggered: this.alarmTriggered,
          frequecy: this.frequency, //parses JSON object
          duration: this.duration,
                     };
        callingObject.stateChangeListener(state);
      }

    },

     // NOTE: New setup function to do initial setup
     setup: function() {
      // Create a particle object
      particle = new Particle();

      // Get ready to subscribe to the event stream
       function d(e)
       {
         console.log("Double success") //ensures that the publishing of publishState was successful so the UI can receive initial state of Photon
       }

       function f(e)
       {
         console.log("FAIL")
       }

      function onSuccess(stream) {
        // This will "subscribe' to the stream and get the state
        console.log("getEventStream success")
        stream.on('event', newBoxEvent)

        // Gets the initial state. Calls the function that will publish the state

        var functionData = {
           deviceId:myDeviceId,
           name: "publishState",
           argument: "",
           auth: myParticleAccessToken
         }
         particle.callFunction(functionData).then(d,f)

      }
      function onFailure(e) { console.log("getEventStream call failed")
                              console.dir(e) }
      // Subscribe to the stream
      particle.getEventStream( { name: topic, auth: myParticleAccessToken, deviceId: 'mine' }).then(onSuccess, onFailure)
    }

}
