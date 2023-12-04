var jsonData = {}; 
var currentCellData;
var currentType = "";  
var currentCellId = ""; 

/* On page load add an event listener to each cell. */
document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('addEventButton').hidden = true; 
  document.getElementById('savesessionbtn').hidden = true; 
  document.getElementById('deletesessionbtn').hidden = true; 
  var cells = document.querySelectorAll('td');
  cells.forEach(function (cell) {
      cell.addEventListener('click', function () {
          openPopupEdit(this);
      });
    });
});
  

/* This function should send an XMLHttpRequest to the server to get all of the 
training schedule data. Not sure as yet of the form of the data. */
function getTrainingData() {

  console.log('Getting data from Flask'); 

  //Create a HTTP request to talk to the Flask app. 
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          jsonData = JSON.parse(this.responseText);
          console.log(jsonData);
          getUserType();  
          loadData(); 
      } else {
          console.log('xhttp request problem occurred', this.status); 
      }
  }

  xhttp.open("GET", "api/users", true); 
  xhttp.send(); 

}

/* This function should get the user type, and dependant on the returns, should 
set up the page functionality accordingly. If the user is a coach, they should
be able to add and edit and delete sessions, if not, then they should not be able
to have access to this functionality (default~?) */ 
function getUserType() {

  let xhttp = new XMLHttpRequest(); 
  let url = "/api/get-current-user-type"; 

  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      let tempObj = JSON.parse(this.responseText); 
      console.log(tempObj); 
      currentType = tempObj.type;
      console.log(currentType); 
      if (currentType === "coach") {
        enableCoachFunctionality(); 
      }
    }
  }

  xhttp.open('GET', url, true); 
  xhttp.send(); 

}

function enableCoachFunctionality() {
  document.getElementById('addEventButton').hidden = false; 
  document.getElementById('savesessionbtn').hidden = false; 
  document.getElementById('deletesessionbtn').hidden = false; 
  document.getElementById('l-time').innerHTML = "Select Time:"
  document.getElementById('l-day').innerHTML = "Select Day:";
  document.getElementById('l-class').innerHTML = "Select Training Class:";
  document.getElementById('l-location').innerHTML = "Select Location:";  
}

/* Within the training schedule json file, the array is an array of objects
that includes an id that matches an id of a td element in the html file. Therefore,
we should loop through the array, possibly using a foreach loop, and set the data
within the html file, at the tdid=jsonid to jsonclass */ 
function loadData() {
  console.log("Loading data into the page"); 
  
  let scheduleLength = jsonData.trainingschedule.length;

  for (let i = 0; i < scheduleLength; i++) {
    document.getElementById(jsonData.trainingschedule[i].id).innerHTML = jsonData.trainingschedule[i].class;
  }
}

/* This function will return the index of a certain class type based on the clicked box. */
function getSelectedIndex(cell) {

  let currentSession = {}; 
   for (let i = 0; i < jsonData.trainingschedule.length; i++) {
    if (jsonData.trainingschedule[i].id == cell.id) {
      currentSession = jsonData.trainingschedule[i]; 
      console.log(currentSession); 
    } 
   }

   let returnArray = [0 , 0];

   switch (currentSession.class) {
    case " ":
      returnArray[0] = 0; 
      break;
    case "Mobility":
      returnArray[0] = 1;
      break;
    case "Stamina":
      returnArray[0] = 2; 
      break;
    case "Strength":
      returnArray[0] = 3; 
      break;
    case "Flexibility":
      returnArray[0] = 4;
      break;
    case "Core":
      returnArray[0] = 5;
      break;
    case "Skill":
      returnArray[0] = 6; 
      break;
    case "Recovery":
      returnArray[0] = 7;
      break;
    case "Tactics": 
      returnArray[0] = 8; 
      break;
    case "TeamBuilding":
      returnArray[0] = 9; 
      break;
    default: 
      returnArray[0] = 1; 
   }

   switch (currentSession.location) {
    case "Outdoor Sports Field":
      returnArray[1] = 0; 
      break;
    case "Gym":
      returnArray[1] = 1; 
      break; 
    case "Fitness Center":
      returnArray[1] = 2; 
      break;
    case "Multipurpose Hall":
      returnArray[1] = 3; 
      break; 
    default: 
      returnArray[1] = 1; 
   }


   return returnArray; 
}

/* This function runs when the delete button is clicked and should reset the training session to null */
function deleteSession() {
  console.log("Deleting Session", currentCellId); 
  
  for (let i = 0; i < jsonData.trainingschedule.length; i++) {
    if (currentCellId === jsonData.trainingschedule[i].id) {
      jsonData.trainingschedule[i].class = ""; 
      console.log("deleting cell: ", currentCellId, jsonData.trainingschedule[i].id);
    }
  }

  loadData(); 
  closePopup(); 
}

/* This function should populate the popup screen with the correct information for the class */
function openPopupEdit(cell) {
  console.log(cell.id); 
  currentCellId = cell.id; 

  let arr = getSelectedIndex(cell);
  document.getElementById('trainingClass').selectedIndex = arr[0];
  document.getElementById('location').selectedIndex = arr[1];  
}

/* This function returns the window location to dashboard, dependant on user type. 
This function also needs to upload the new json file if anything has been changed.*/
function returnToDashboard() {

  //Send json data to server.
  let send_data = {"data": jsonData}; 

  let xhttp = new XMLHttpRequest(); 
  let url = "/api/upload/trainingsession"; 

  xhttp.open('POST', url, true); 
  send_data = JSON.stringify(send_data); 
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(send_data); 

  
  if (currentType == "player") {
    window.location = "http://127.0.0.1:5000/userdashboard"; 
  } else if (currentType == "coach") {
    window.location = "http://127.0.0.1:5000/coachdashboard"; 
  } else {
    window.location = "http://127.0.0.1:5000/userdashboard"; 
  }
  
}
 

window.onload = getTrainingData; 