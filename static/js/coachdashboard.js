var currentUserObject = {}; 
var data = {};

//This function gets the current user info from the Flask app and stores it in Test Object,
//Change the test object to a current user object, and we can dynamically set any user info
//on any of the HTML pages. Changed on userdashboard.js
function getCurrentUser() {

    //Create a HTTP request to talk to the Flask app. 
    let xhttp = new XMLHttpRequest();
     xhttp.onreadystatechange = function() {
       if (this.readyState == 4 && this.status == 200) {
            currentUserObject = JSON.parse(this.responseText);
            console.log(currentUserObject); 
            loadUserInfo(); 
         } else {
           console.log('xhttp request problem occurred', this.status); 
         }
    }

    xhttp.open("GET", "api/get-current-user", true); 
    xhttp.send(); 

}

/* Function to dynamically load in the current user info into the userdashboard page 
   NOTE: If ids on the html page from copy pasting ai code, update ids within the 
   profile section of the code so that we can still update them. */
function loadUserInfo() {

    let el = document.getElementById('user-info-name');
    el.innerHTML = currentUserObject.name; 
    el = document.getElementById('user-info-dob');
    el.innerHTML = currentUserObject.dob; 
    el = document.getElementById('user-info-email');
    el.innerHTML = currentUserObject.email; 
    
}

/* This function should send an XMLHttpRequest to the server to get all of the 
json data. Not sure as yet of the form of the data. */
function getData() {

  console.log('Getting data from Flask'); 

  //Create a HTTP request to talk to the Flask app. 
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          data = JSON.parse(this.responseText);
          console.log(data);
          loadTableInfo(); 
      } else {
          console.log('xhttp request problem occurred', this.status); 
      }
  }

  xhttp.open("GET", "api/users", true); 
  xhttp.send(); 

}

/* This function will load all of the relevant info into the tables on the dashboard */
function loadTableInfo() {

  //Fixtures Table
  document.getElementById('f-r1-d').innerHTML = data.fixtures[0].date;
  document.getElementById('f-r1-t').innerHTML = data.fixtures[0].team1; 

  document.getElementById('f-r2-d').innerHTML = data.fixtures[1].date;
  document.getElementById('f-r2-t').innerHTML = data.fixtures[1].team1; 

  document.getElementById('f-r3-d').innerHTML = data.fixtures[2].date;
  document.getElementById('f-r3-t').innerHTML = data.fixtures[2].team1; 

  document.getElementById('f-r4-d').innerHTML = data.fixtures[3].date;
  document.getElementById('f-r4-t').innerHTML = data.fixtures[3].team1;

  //Results table
  document.getElementById('r-r1-t').innerHTML = data.results[0].team1; 
  document.getElementById('r-r1-s').innerHTML = (data.results[0].team1Score + " : " + data.results[0].team2Score); 

  document.getElementById('r-r2-t').innerHTML = data.results[1].team2; 
  document.getElementById('r-r2-s').innerHTML = (data.results[1].team1Score + " : " + data.results[1].team2Score); 

  document.getElementById('r-r3-t').innerHTML = data.results[2].team1; 
  document.getElementById('r-r3-s').innerHTML = (data.results[2].team1Score + " : " + data.results[2].team2Score); 

  document.getElementById('r-r4-t').innerHTML = data.results[3].team2; 
  document.getElementById('r-r4-s').innerHTML = (data.results[3].team1Score + " : " + data.results[3].team2Score);


}


/* This function will relocate the user to the training schedule page */
function onClickTrainingSchedule() {
  window.location = "http://127.0.0.1:5000/trainingschedule"; 
}

/* This function should send a http request to the server containing the current
user info, and the server should then delete the record containing the current
user information from the database. Then the window should reload to the signin. */
function onClickDeleteAccount() {

  let xhttp = new XMLHttpRequest();
  let url = "/api/upload/delete/coach";
  let user_info = {'user_info': currentUserObject};

  xhttp.onreadystatechange = function() {

    if (this.readyState == 4 && this.status == 200) {
      //strResponse = JSON.parse(this.responseText); 
      alert("Account Deleted!"); 
      window.location = "http://127.0.0.1:5000/";
    }

  }

  xhttp.open('PUT', url, true); 
  let data = JSON.stringify(user_info);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(data);

}

/* This function will transport the user to another page, where the user will be able to 
update their current details that are stored on the db. All this page needs to do it to 
change the window location alongside ensuring the current user details are correct */
function onClickUpdateAccount() {
  console.log("Updating Details");
  window.location =  "http://127.0.0.1:5000/updatedetails"; 
}

/* This function will take the user to the results page, where they can see past results*/
function onClickResultsPage() {
  window.location = "http://127.0.0.1:5000/resultslist"; 
}

/* This function will take the user to a fixtures page, where they can see upcoming fixtures */
function onClickFixturesPage() {
  window.location = "http://127.0.0.1:5000/fixturelist"; 
}

/* This function will return the user to the login screen, and because the current user
details are reset every time a user logs in, this is the same as wiping the details in a 
system of our scope. */
function onClickLogOut() {
  console.log("Logging Out");
  window.location =  "http://127.0.0.1:5000/";
}

document.getElementById("training-schedule-link").addEventListener("click", onClickTrainingSchedule);
document.getElementById('delete-account-button').addEventListener("click", onClickDeleteAccount);
document.getElementById('update-account-button').addEventListener("click", onClickUpdateAccount);
document.getElementById('link-results').addEventListener('click', onClickResultsPage);
document.getElementById('link-fixtures').addEventListener('click', onClickFixturesPage);
document.getElementById('log-out-button').addEventListener("click", onClickLogOut);
window.onload = getCurrentUser, getData; 
