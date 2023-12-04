var currentType = ""; 

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

/* This function should determine the user type (coach, player) and return to relevant dashboard. */
function returnToDashboard() {
 
  if (currentType == "player") {
    window.location = "http://127.0.0.1:5000/userdashboard"; 
  } else if (currentType == "coach") {
    window.location = "http://127.0.0.1:5000/coachdashboard"; 
  } else {
    window.location = "http://127.0.0.1:5000/userdashboard";
  }

}

document.getElementById('return-to-dashboard').addEventListener("click", returnToDashboard);