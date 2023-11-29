const jsonFilePath = '/data/data.json'; 
var usersObj = {}; 
var currentUser = {}; 
var currentType = {type: ""}; 

/*This function returns the json file data, and stores user data in the
usersObj object. This can then be accessed using usersObj.users.{username,
password, email, type} etc. */
function getJSONData () {

        console.log('Getting users from Flask'); 

        //Create a HTTP request to talk to the Flask app. 
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                usersObj = JSON.parse(this.responseText);
                console.log(usersObj); 
            } else {
                console.log('xhttp request problem occurred', this.status); 
            }
        }

        xhttp.open("GET", "api/users", true); 
        xhttp.send(); 
    
}

/*This function should return dynamic HTML content to promt the 
user into re-entering their username because it is incorrect.
The username has already been checked in the buttonLoginClick() function*/ 
function incorrectUsername() {
    console.log('no matching user found'); 
    let el = document.getElementById('incorrect-username'); 
    el.hidden = false; 
}


/*This function should return dynamic HTML content to promt the 
user into re-entering their password because it is incorrect.
The password has already been checked in the buttonLoginClick() function*/ 
function incorrectPassword() {
    console.log('no matching password found'); 
    document.getElementById('incorrect-password').hidden = false; 
}

/*This function runs when the login button has been clicked. It checks
the user-entered usernames and passwords against the usersObj list of 
valid users and passwords, and if the input is authenticated, the page 
changes url to the relevant dashboard of either a player or coach.*/ 
function buttonLoginClick() {
    //Validate the login information 
    let username = document.getElementById('loginUsername').value; 
    let password = document.getElementById('loginPassword').value; 

    document.getElementById('incorrect-username').hidden = true; 
    document.getElementById('incorrect-password').hidden = true; 

    let i = 0; 
    let coachArrayLength = Object.keys(usersObj.users[1].coaches).length;
    let playerArrayLength = Object.keys(usersObj.users[0].players).length; 
    let userFound = false;  

    do {

        console.log("Currently Checking user: ", usersObj.users[0].players[i].username, " against ", username); 

        if (usersObj.users[0].players[i].username === username) {
            console.log('Username Matches'); 
            userFound = true; 

            console.log("Currently Checking password: ", usersObj.users[0].players[i].password, " against", password); 
            if (usersObj.users[0].players[i].password === String(password)) {
                //Correct login details.
                currentUser = usersObj.users[0].players[i];  
                
                currentType.type = "player"; 
                setCurrentUser(); 
                window.location.assign('/userdashboard'); 

            } else {
                incorrectPassword(); 
            }
        }

        i++;  
    } while ((i < playerArrayLength) && (userFound === false)); 

    //If the user trying to log in is not within the players array, then we check the coaches array
    let j = 0; 
    if (userFound === false) {
       do {

        console.log("Currently checking Coach: ", usersObj.users[1].coaches[j].username, " against ", username);

        if (usersObj.users[1].coaches[j].username === username) {
            console.log('username matches'); 
            userFound = true; 

            console.log("Currently Checking password: ", usersObj.users[1].coaches[j].password, " against ", password); 
            if (usersObj.users[1].coaches[j].password === password) {
                //Correct Login Details
                currentUser = usersObj.users[1].coaches[j];

                currentType.type = "coach"; 
                setCurrentUser(); 
                window.location.assign('/coachdashboard');
                 
            } else {
                incorrectPassword(); 
            }
        }

        j++;
       } while ((j < coachArrayLength) && (userFound === false)); 

    }

    userFound ? null : incorrectUsername(); //Ternary Operator

}

/* Set up the link to the sign-up page: this function should disallow the link from being clicked
and replace it with a flask call and add the signup to the url. Flask should then return the 
template for the signup page. */
const signupLink = document.getElementById('signup-link'); 
signupLink.addEventListener('click', function(event) {
    event.preventDefault();
    console.log("User Directing to Signup Page"); 
    window.location.assign('/signup'); 
});

/* Functionality for setting the current user server side.
This function will take the current user object and add it to a variable in the Flask app. This
will mean that when loading other pages, we can grab the current user from anywhere in the program. */
function setCurrentUser() {
    console.log("Setting Current User & Type");
    
    let xhttp = new XMLHttpRequest(); 
    let url = '/api/set-current-user'; 

    xhttp.onreadystatchange = function() {

        if (this.readyState == 4 && this.status == 200) {
          strResponse = JSON.parse(this.responseText);
          alert(strResponse.message)
        }   
      }
    
    xhttp.open('PUT', url, true)
    var data = JSON.stringify(currentUser)
    xhttp.setRequestHeader("Content-Type", "application/json")
    xhttp.send(data)
 
    let xhttp2 = new XMLHttpRequest();
    url = "/api/set-current-user-type";

    xhttp2.onreadystatechange = function() {
        if (this.readystate == 4 && this.status == 200) {
            console.log("set user type")
        }
    }

    xhttp2.open('PUT', url, true)
    data = JSON.stringify(currentType)
    xhttp2.setRequestHeader("Content-Type", "application/json")
    xhttp2.send(data); 

}

//This function gets the current user info from the Flask app and stores it in Test Object,
//Change the test object to a current user object, and we can dynamically set any user info
//on any of the HTML pages. 
function getCurrentUser() {
    let testObject = {}; 

    //Create a HTTP request to talk to the Flask app. 
    let xhttp = new XMLHttpRequest();
     xhttp.onreadystatechange = function() {
       if (this.readyState == 4 && this.status == 200) {
            testObject = JSON.parse(this.responseText);
            console.log(this.responseText); 
            console.log(testObject); 
         } else {
           console.log('xhttp request problem occurred', this.status); 
         }
    }

    xhttp.open("GET", "api/get-current-user", true); 
    xhttp.send(); 

}

//Add event listeners
let el = document.getElementById('loginFormButton');
el.addEventListener("click", buttonLoginClick);

window.onload = getJSONData; 