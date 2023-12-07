var currentType = ""; 
var jsonData = {}; 

/* This function should send an XMLHttpRequest to the server to get all of the 
training schedule data. Not sure as yet of the form of the data. */
function getData() {

  console.log('Getting data from Flask'); 

  //Create a HTTP request to talk to the Flask app. 
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          jsonData = JSON.parse(this.responseText);
          console.log(jsonData);
          loadData(); 
      } else {
          console.log('xhttp request problem occurred', this.status); 
      }
  }

  xhttp.open("GET", "api/users", true); 
  xhttp.send(); 

}

/* This function should load the data in to the fixture list */
function loadData() {
  console.log("Loading Data"); 

  document.getElementById('f1-tn1').innerHTML = jsonData.fixtures[0].team1;
  document.getElementById('f1-tn2').innerHTML = jsonData.fixtures[0].team2;
  document.getElementById('f1-mn').innerHTML = (jsonData.fixtures[0].team1 + " v " + jsonData.fixtures[0].team2); 
  document.getElementById('f1-d').innerHTML = jsonData.fixtures[0].date;
  document.getElementById('f1-t').innerHTML = jsonData.fixtures[0].time;

  document.getElementById('f2-tn1').innerHTML = jsonData.fixtures[1].team1;
  document.getElementById('f2-tn2').innerHTML = jsonData.fixtures[1].team2;
  document.getElementById('f2-mn').innerHTML = (jsonData.fixtures[1].team1 + " v " + jsonData.fixtures[1].team2); 
  document.getElementById('f2-d').innerHTML = jsonData.fixtures[1].date;
  document.getElementById('f2-t').innerHTML = jsonData.fixtures[1].time; 

  document.getElementById('f3-tn1').innerHTML = jsonData.fixtures[2].team1;
  document.getElementById('f3-tn2').innerHTML = jsonData.fixtures[2].team2;
  document.getElementById('f3-mn').innerHTML = (jsonData.fixtures[2].team1 + " v " + jsonData.fixtures[2].team2); 
  document.getElementById('f3-d').innerHTML = jsonData.fixtures[2].date;
  document.getElementById('f3-t').innerHTML = jsonData.fixtures[2].time;
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

window.onload = getData; 