var tracker = "logger"
var alarmon = false


function logUpdate() // updates to the login page
{
    tracker = "logger"
    autoHide()
}

function signUpdate() // updates to the sign up page
{
    tracker = "signup"
    autoHide()
}

function stUpdate() // updates to the status page
{
    tracker = "st"
    autoHide()
}

function freqchange(event) { // updates the value of the frequency
    freqtext.innerText = freqslider.value 
    box.setFrequency(freqslider.value)
  }

  function durchange(event) { // updates the value of the duration
    durtext.innerText = durslider.value + "ms"
    box.setDuration(durslider.value)
  }

  function alarmed(event) { // updates the value of the alarm state
    alarmon = !alarmon
    box.setState(alarmon)
  }

function autoHide() // automatically hides all the pages not in use
{
    if (tracker == "logger")
    {
        logger.hidden = false
        signup.hidden = true
     
        st.hidden = true
    }

    if (tracker == "signup")
    {
        logger.hidden = true
        signup.hidden = false
       
        st.hidden = true
    }

    if (tracker == "st")
    {
        logger.hidden = true
        signup.hidden = true
    
        st.hidden = false
    }
}

function stateUpdate(newState) {  // Updates the UI with the new alarm system state
    console.log("stateupdate")
    console.dir(newState)
    alarmswitch.disabled = false
    alarmswitch.checked = newState.alarmState //disable and then enablign allows the custom checkbox switch to be turned on only when set by the Photon
    alarmswitch.disabled = true
    if (alarmswitch.checked)
    {
      alarmtext.innerText = "On"
    }

    else
    {
      alarmtext.innerText = "Off"
    }
    freqslider.value = newState.frequency
    durslider.value = newState.duration
    
    if (newState.alarmTriggered)
    {
       valstatus.innerText = "NOT PROTECTED"
    }

    else if (newState.alarmState)
    {
       valstatus.innerText = "PROTECTED"
    }
 }

  

// On startup:  Things to do once the page is fully loaded and the DOM is configured
document.addEventListener("DOMContentLoaded", function(event) {
    //Sets different pages of application
    logger = document.getElementById("logger")
    signup = document.getElementById("signup")
    st = document.getElementById("status")

    logUpdate()

    //beepslider = document.getElementById("beepslider")
    freqslider = document.getElementById("frequencyslider")
    durslider = document.getElementById("durationslider")
    valstatus = document.getElementById("valuables")
    freqtext = document.getElementById("freqtext")
    durtext = document.getElementById("durtext")
    alarmtext = document.getElementById("alarmtext")
    alarmlabel = document.getElementById("alarmlabel")
    alarmswitch = document.getElementById("alarm")
    alarmswitch.disabled = true

    // Event handlers
    //document.getElementById("lbutton").addEventListener("click", stUpdate)
  
    //document.getElementById("statusout").addEventListener("click", logUpdate)
    document.getElementById("logtosign").addEventListener("click", signUpdate)
    document.getElementById("signtolog").addEventListener("click", logUpdate)
    

    freqslider.addEventListener("change", freqchange) 
    durslider.addEventListener("change", durchange) 
    alarmlabel.addEventListener("click", alarmed)

    document.getElementById("lightValue")

    //Used to start the linkage between the device hardware and UI
     box.setStateChangeListener(stateUpdate)
     box.setup()

    // Update the state of elements not changed by the garage's state
    autoHide()
  })

  ////////////////////////////////////////////////////////////////////////////////////////////

  //Node.js server functions

  // URL mapping, from hash to a function that responds to that URL action
const router = {
  "/": () => showContent("content-home"),
  "/profile": () =>
    requireAuth(() => showContent("content-profile"), "/profile"),
  "/login": () => login()
};

//Auth0 server functions for updating the UI after authentication

/**
 * Iterates over the elements matching 'selector' and passes them
 * to 'fn'
 * @param {*} selector The CSS selector to find
 * @param {*} fn The function to execute for every element
 */
const eachElement = (selector, fn) => {
  for (let e of document.querySelectorAll(selector)) {
    fn(e);
  }
};

/**
 * Tries to display a content panel that is referenced
 * by the specified route URL. These are matched using the
 * router, defined above.
 * @param {*} url The route URL
 */
const showContentFromUrl = (url) => {
  if (router[url]) {
    router[url]();
    return true;
  }

  return false;
};

/**
 * Returns true if `element` is a hyperlink that can be considered a link to another SPA route
 * @param {*} element The element to check
 */
const isRouteLink = (element) =>
  element.tagName === "A" && element.classList.contains("route-link");

/**
 * Displays a content panel specified by the given element id.
 * All the panels that participate in this flow should have the 'page' class applied,
 * so that it can be correctly hidden before the requested content is shown.
 * @param {*} id The id of the content to show
 */
const showContent = (id) => {
  eachElement(".page", (p) => p.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
};

/**
 * Updates the user interface
 */
const updateUI = async () => {
  try {
    const isAuthenticated = await auth0.isAuthenticated();

    if (isAuthenticated) {
      const user = await auth0.getUser();

      document.getElementById("profile-data").innerText = JSON.stringify(
        user,
        null,
        2
      );

      document.querySelectorAll("pre code").forEach(hljs.highlightBlock);

     stUpdate()

      eachElement(".profile-image", (e) => (e.src = user.picture));
      eachElement(".user-name", (e) => (e.innerText = user.name));
      eachElement(".user-email", (e) => (e.innerText = user.email));
      eachElement(".auth-invisible", (e) => e.classList.add("hidden"));
      eachElement(".auth-visible", (e) => e.classList.remove("hidden"));
    } else {
      eachElement(".auth-invisible", (e) => e.classList.remove("hidden"));
      eachElement(".auth-visible", (e) => e.classList.add("hidden"));
      
      logUpdate()
    }
  } catch (err) {
    console.log("Error updating UI!", err);
    return;
  }

  console.log("UI updated");
};

window.onpopstate = (e) => {
  if (e.state && e.state.url && router[e.state.url]) {
    showContentFromUrl(e.state.url);
  }
};

