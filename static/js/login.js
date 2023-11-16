const jsonFilePath = '/data/data.json'; 
var usersObj = {}; 
var currentUser = {}; 

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
user into re-entering their password because it is incorrect.
The password has already been checked in the buttonLoginClick() function*/ 
function incorrectPassword() {
    console.log('no matching password found'); 
}

/*This function should return dynamic HTML content to promt the 
user into re-entering their username because it is incorrect.
The username has already been checked in the buttonLoginClick() function*/ 
function incorrectUsername() {
    console.log('no matching user found'); 
}


/*This function runs when the login button has been clicked. It checks
the user-entered usernames and passwords against the usersObj list of 
valid users and passwords, and if the input is authenticated, the page 
changes url to the relevant dashboard of either a player or coach.*/ 
function buttonLoginClick() {
    //Validate the login information 
    let username = document.getElementById('loginUsername').value; 
    let password = document.getElementById('loginPassword').value; 

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

                window.location.assign('/userdashboard'); 

            } else {
                incorrectPassword(); 
            }
        }

        i++;
        console.log(i, playerArrayLength); 
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

//Add event listeners
let el = document.getElementById('loginFormButton');
el.addEventListener("click", buttonLoginClick);

window.onload = getJSONData; 