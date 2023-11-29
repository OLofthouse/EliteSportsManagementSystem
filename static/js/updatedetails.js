var currentUserObject = {};
var currentType = "";  

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
         } else {
           console.log('xhttp request problem occurred', this.status); 
         }
    }

    xhttp.open("GET", "api/get-current-user", true); 
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

/* This function should determine the user type (coach, player) and return to relevant dashboard. */
function returnToDashboard() {

  let xhttp = new XMLHttpRequest(); 
  let url = "/api/get-current-user-type"; 

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      console.log("returning to dashboard");
      let tempObj = JSON.parse(this.responseText); 
      currentType = tempObj.type; 
      if (currentType == "player") {
        window.location = "http://127.0.0.1:5000/userdashboard"; 
      } else if (currentType == "coach") {
        window.location = "http://127.0.0.1:5000/coachdashboard"; 
      }
    }
  }

  xhttp.open('GET', url, true); 
  xhttp.send(); 

}

document.getElementById('return-to-dashboard').addEventListener("click", returnToDashboard);
window.onload = getCurrentUser; 