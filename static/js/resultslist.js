var currentType = ""; 
var jsonData = {}; 

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

  document.getElementById('r1-tn1').innerHTML = jsonData.results[0].team1;
  document.getElementById('r1-tn2').innerHTML = jsonData.results[0].team2;
  document.getElementById('r1-mn').innerHTML = (jsonData.results[0].team1 + " v " + jsonData.results[0].team2); 
  document.getElementById('r1-d').innerHTML = jsonData.results[0].date;
  document.getElementById('r1-t').innerHTML = jsonData.results[0].time;
  document.getElementById('r1-ts1').innerHTML = jsonData.results[0].team1Score;
  document.getElementById('r1-ts2').innerHTML = jsonData.results[0].team2Score;

  document.getElementById('r2-tn1').innerHTML = jsonData.results[1].team1;
  document.getElementById('r2-tn2').innerHTML = jsonData.results[1].team2;
  document.getElementById('r2-mn').innerHTML = (jsonData.results[1].team1 + " v " + jsonData.results[1].team2); 
  document.getElementById('r2-d').innerHTML = jsonData.results[1].date;
  document.getElementById('r2-t').innerHTML = jsonData.results[1].time; 
  document.getElementById('r2-ts1').innerHTML = jsonData.results[1].team1Score;
  document.getElementById('r2-ts2').innerHTML = jsonData.results[1].team2Score; 

  document.getElementById('r3-tn1').innerHTML = jsonData.results[2].team1;
  document.getElementById('r3-tn2').innerHTML = jsonData.results[2].team2;
  document.getElementById('r3-mn').innerHTML = (jsonData.results[2].team1 + " v " + jsonData.results[2].team2); 
  document.getElementById('r3-d').innerHTML = jsonData.results[2].date;
  document.getElementById('r3-t').innerHTML = jsonData.results[2].time;
  document.getElementById('r3-ts1').innerHTML = jsonData.results[2].team1Score;
  document.getElementById('r3-ts2').innerHTML = jsonData.results[2].team2Score; 
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