var inputUsername, inputDob, inputEmail, inputPassword, inputConfirmPassword, inputUserType, inputName; 
var usersObj = {}; 
var signupInfo = {}; 


/* This function contains all the logic to ensure a successful creation
of a user account on the system. All the information in the form is
packaged up and sent to flask to be stored in the DB. */ 
function signUpUser() {
  inputUsername = document.getElementById('username').value; 
  inputDob = document.getElementById('dob').value; 
  inputEmail = document.getElementById('email').value; 
  inputPassword = document.getElementById('password').value; 
  inputConfirmPassword = document.getElementById('confirmPassword').value;
  inputUserType = "none";  

   //Get User Type: Player/Coach
   if (document.getElementById('player').checked) {
    inputUserType = "player"; 
  } else if (document.getElementById('admin').checked) {
    inputUserType = "coach"; 
  } else {
    alert('Please select a user type: player or coach'); 
  }

  //Validate Inputs
  if (inputUsername == "") {
    console.log("No username entered"); 
  } else if (inputDob == "") {
    console.log('No DOB entered'); 
  } else if (inputEmail == "") {
    console.log("No email entered"); 
  } else if (inputPassword == "") {
    console.log("No Password Entered"); 
  } else if (inputConfirmPassword == "") {
    console.log("No confirm password Entered"); 
  } else if (inputUserType == "none") {
    console.log("no user type selected"); 
  } else if (inputPassword != inputConfirmPassword) {
    console.log("passwords do not match"); 
  } else {
    //All inputs valid, run checks 
    console.log('Uploading user'); 
    checkUserValidity(); 
  }

  //Update signup screen to include name
  inputName = "Standard Name"; 

  signupInfo = {
    "username": inputUsername,
    "password": inputPassword, 
    "name": inputName,
    "email": inputEmail, 
    "dob": inputDob
  };

  console.log("username: ", inputUsername, " dob: ", inputDob, " email: ", inputEmail, " password: ", inputPassword, " confirmPassword: ", inputConfirmPassword); 
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

function validityCheckSuccessReturn() {

  let playersObj = usersObj.users[0].players; 
  let coachesObj = usersObj.users[1].coaches;  

  let existingUsername = false; 

  let i = 0; 
  let playersLength = Object.keys(playersObj).length; 
  do {

    if (inputUsername.toLowerCase() === playersObj[i].username.toLowerCase()) {
      //Username matches one already in database
      existingUsername = true; 
      invalidUsername(); 
    }

    i++;
  } while ((i < playersLength) && (existingUsername == false)); 

  i = 0; 
  let coachesLength = Object.keys(coachesObj).length; 
  do {

    if (inputUsername.toLowerCase() === coachesObj[i].username.toLowerCase()) {
      //Username matches one already in database
      existingUsername = true; 
      invalidUsername(); 
    }

    i++;
  } while ((i < coachesLength) && (existingUsername == false)); 
  
  //If the program has run the checks and the username is still unqiue. Then store in database
  if (existingUsername == false) {
    validUsername(); 
  }

}

function invalidUsername() {
  alert("Username invalid: please try another"); 
  window.location.reload(); 
}

/* This function will upload user details to the flask app, and store the new user details in the db */ 
function validUsername() {

  //Send info in an array called 'user_info'
  //Determine user type

  let user_info = {"user_info": signupInfo}
  
  let xhttp = new XMLHttpRequest()
  let url = "/api/upload/signup/player"

  xhttp.onreadystatchange = function() {

    if (this.readyState == 4 && this.status == 200) {
      strResponse = JSON.parse(this.responseText);
      alert(strResponse.message)
    }   
  }

  xhttp.open('POST', url, true)
  let data = JSON.stringify(user_info)
  xhttp.setRequestHeader("Content-Type", "application/json")
  xhttp.send(data)
  

}

//Function runs when the user clicks on the return to login link. 
//Returns the url of the site to the root, returns the user to the
//Login page
function returnToLogin() {
  window.location =  "http://127.0.0.1:5000/";
}

//Add event listeners
let btnEl = document.getElementById('return-to-login');
btnEl.addEventListener('click', returnToLogin); 

btnEl = document.getElementById('form-submit-button');
btnEl.addEventListener("click", signUpUser); 