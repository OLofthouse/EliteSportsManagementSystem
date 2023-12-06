var currentUserObject = {};
var updatedUserObject = {}; 
var usersObj = {};
var currentType = "";
var setPassword; 
var isPasswordChanged = false; 
var isDobChanged = false;
var isEmailChanged = false;
var isNameChanged = false;   

/* This function should get the user details from the server ready to be updated
 and call the function that populates the form data */
function getCurrentUser() {

    //Create a HTTP request to talk to the Flask app. 
    let xhttp = new XMLHttpRequest();
     xhttp.onreadystatechange = function() {
       if (this.readyState == 4 && this.status == 200) {
            currentUserObject = JSON.parse(this.responseText);
            console.log(currentUserObject); 
            fillFormData(); 
            getCurrentType(); 
         } else {
           console.log('xhttp request problem occurred', this.status); 
         }
    }

    xhttp.open("GET", "api/get-current-user", true); 
    xhttp.send(); 

}

/* This function will set the current user type to either coach or player */
function getCurrentType() {

  let xhttp = new XMLHttpRequest(); 
  let url = "/api/get-current-user-type"; 

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log("returning to dashboard");
      let tempObj = JSON.parse(this.responseText); 
      currentType = tempObj.type;
    }
  }

  xhttp.open('GET', url, true); 
  xhttp.send(); 

}

/* This function converts the date from the python backend to the correct format for the js. */
function convertDateFormat(dateString) {

  var dateComponents = dateString.split('-');

  var newDate = new Date(dateComponents[2], dateComponents[1] - 1, dateComponents[0]);

  var yyyy = newDate.getFullYear();
  var mm = String(newDate.getMonth() + 1).padStart(2, '0');
  var dd = String(newDate.getDate()).padStart(2, '0');

  var formattedDate = yyyy + '-' + mm + '-' + dd;
  return formattedDate;
}

/* This function will fill the data on the update details page with current
 user information */
function fillFormData() {
  document.getElementById('username').value = currentUserObject.username; 
  document.getElementById('dob').value = convertDateFormat(currentUserObject.dob);
  document.getElementById('email').value = currentUserObject.email;
  document.getElementById('fullName').value = currentUserObject.name; 
}

/* This function should get the current user details from the db, and ensure 
that the details the user is currently trying to sign up with is not matching
to the "primary keys" of the database. */
function checkUserValidity() {

  console.log("Checking Validity"); 

  //Create a HTTP request to talk to the Flask app. 
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          usersObj = JSON.parse(this.responseText);
          console.log(usersObj); 
          validityCheckSuccessReturn(); 
      } else {
          console.log('xhttp request problem occurred', this.status); 
      }
  }

  xhttp.open("GET", "api/users", true); 
  xhttp.send(); 

}

/* This function checks the current inputted username against all of the curreent
usernames on the system, and only if the username is not in the system already 
within the players and the coaches systems can the user change their username. */
function validityCheckSuccessReturn() {

  let playersObj = usersObj.users[0].players; 
  let coachesObj = usersObj.users[1].coaches;  

  let existingUsername = false; 

  let i = 0; 
  let playersLength = Object.keys(playersObj).length; 
  do {

    if (updatedUserObject.username.toLowerCase() === playersObj[i].username.toLowerCase()) {
      //Username matches one already in database
      existingUsername = true; 
      invalidUsername(); 
    }

    i++;
  } while ((i < playersLength) && (existingUsername == false)); 

  i = 0; 
  let coachesLength = Object.keys(coachesObj).length; 
  do {

    if (updatedUserObject.username.toLowerCase() === coachesObj[i].username.toLowerCase()) {
      //Username matches one already in database
      existingUsername = true; 
      invalidUsername(); 
    }

    i++;
  } while ((i < coachesLength) && (existingUsername == false)); 
  
  //If the program has run the checks and the username is still unqiue. Then store in database
  if (existingUsername == false) {
    removeOldDetails(); 
  }

}

/* This function will upload user details to the flask app, and store the new user details in the db */ 
function updateServerside() {

  //Send info in an array called 'user_info'
  //Determine user type

  let user_info = {"user_info": updatedUserObject};
  
  let xhttp = new XMLHttpRequest();
  let url = "/api/upload/signup/player";

  if (currentType === "player") {
    url = "/api/upload/signup/player";
  } else if (currentType === "coach") {
    url = "/api/upload/signup/coach";
  }

  xhttp.onreadystatchange = function() {

    if (this.readyState == 4 && this.status == 200) {
      strResponse = JSON.parse(this.responseText);
      //alert(strResponse.message)
      console.log("Sucessfully updated user account"); 
      resetCurrentServerDetails(); 
    }   
  }

  xhttp.open('POST', url, true)
  let data = JSON.stringify(user_info)
  xhttp.setRequestHeader("Content-Type", "application/json")
  xhttp.send(data)
  
  resetCurrentServerDetails(); 

  returnToDashboard(); 
}

/* This function will send a message to the delete route on the server
with the details of the old user, this is because updating = deleting + creating */
function removeOldDetails() {

  let xhttp = new XMLHttpRequest();
  let url = "/api/upload/delete/coach";
  let user_info = {'user_info': currentUserObject};

  if (currentType === "player") {
    url = "/api/upload/delete/player";
  }

  xhttp.onreadystatechange = function() {

    if (this.readyState == 4 && this.status == 200) {
      //strResponse = JSON.parse(this.responseText); 
      console.log("Old Details Deleted");  
      updateServerside(); 
    }

  }

  xhttp.open('PUT', url, true); 
  let data = JSON.stringify(user_info);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(data);

}

/* This function reloads the page and prompts the user to enter another username because the 
one that they have entered is not valid */
function invalidUsername() {
  alert("Username invalid: please try another"); 
  window.location.reload(); 
}

/* This function will check for which details in the boxes differ from the details in the system. 
Then it will take these details, create a user info with it and return it to the server. The server
should run the delete code for the "old user", and then add code for the new user. That way there
is no new server side code needed. Also needs to check if the username has been changed is valid?*/
function updateDetails() {



  //Set updateUserObj to the new user details (because all the details in the boxes are either the 
  //new or the old details, we can just set the details to be the same)
  updatedUserObject = {
    username : document.getElementById('username').value,
    dob : document.getElementById('dob').value, 
    email : document.getElementById('email').value, 
    name : document.getElementById('fullName').value, 
    password : setPassword
  }; 

  console.log(updatedUserObject); 

  //Check valid usernames against list of current usernames, but only if the current username differs. 
  if (updatedUserObject.username != currentUserObject.username) {
    checkUserValidity(); 
  } else {
    //The username hasn't been changed
    if (updatedUserObject.dob != currentUserObject.dob) {isDobChanged = true;}
    if (updatedUserObject.email != currentUserObject.email) {isEmailChanged = true;} 
    if (updatedUserObject.name != currentUserObject.name) {isNameChanged = true;}

    //If any details have been changed, run the changes, if not return to dashboard.
    //No point uploading details that havent been changed, just be deleting and uploading the same thing
    if (isDobChanged || isEmailChanged || isNameChanged || isPasswordChanged) {
      removeOldDetails();  
    } else {
      returnToDashboard(); 
    }
  }

}

/* This function should reset the current user details server side so that the user can instantly view
their updated details on the dashboard. */ 
function resetCurrentServerDetails() {

  console.log("Setting Current User");
    
    let xhttp = new XMLHttpRequest(); 
    let url = '/api/set-current-user'; 

    xhttp.onreadystatchange = function() {

        if (this.readyState == 4 && this.status == 200) {
          strResponse = JSON.parse(this.responseText);
          alert(strResponse.message)
        }   
      }
    
    xhttp.open('PUT', url, true)
    var data = JSON.stringify(updatedUserObject)
    xhttp.setRequestHeader("Content-Type", "application/json")
    xhttp.send(data)

}

/* This function should be the first to be called, to check whether or not the user is trying to set
a new password in the update details section. */
function checkPassword() {
  
  setPassword = currentUserObject.password;
  if (document.getElementById('password').value != "") {
    //Check Validity of new password: 
    if (document.getElementById('password').value != document.getElementById('confirmPassword').value) {
      //Passwords do not match, incorrect, break from script. 
      alert('Passwords Must Match!');  
      location.reload(); 
    } else {
      setPassword = document.getElementById('password').value; 
      isPasswordChanged = true; 
      updateDetails(); 
    }
  } else {
    //No password input, run other checks. 
    updateDetails(); 
  }

}

/* This function should determine the user type (coach, player) and return to relevant dashboard. */
function returnToDashboard() {
 
      if (currentType == "player") {
        window.location = "http://127.0.0.1:5000/userdashboard"; 
      } else if (currentType == "coach") {
        window.location = "http://127.0.0.1:5000/coachdashboard"; 
      }

}

document.getElementById('return-to-dashboard').addEventListener("click", returnToDashboard);
document.getElementById('form-submit-button').addEventListener("click", checkPassword); 
window.onload = getCurrentUser; 