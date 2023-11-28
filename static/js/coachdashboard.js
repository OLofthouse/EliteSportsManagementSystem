var currentUserObject = {}; 

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

document.getElementById('delete-account-button').addEventListener("click", onClickDeleteAccount);
window.onload = getCurrentUser; 