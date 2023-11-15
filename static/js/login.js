const jsonFilePath = '/data/data.json'; 
var usersObj = {}; 
var currentUser = {}; 

function getJSONData () {
    
    /*fetch(jsonFilePath) 
        .then(response => response.json())
        .then(data => {
            //Process data 
            usersObj = data.users;
            console.log(usersObj);
        })
        .catch(error => {
            console.error('Error Fetching data: ', error); 
        })*/

        console.log('Getting users from Flask'); 

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

function incorrectPassword() {
    console.log('no matching user found'); 
}

function incorrectUsername() {
    console.log('no matching user found'); 
}


function buttonLoginClick() {
    //Validate the login information 
    let username = document.getElementById('loginUsername').value; 
    let password = document.getElementById('loginPassword').value; 


    let i = 0; 
    let arrayLength = Object.keys(usersObj).length;
    let userFound = false;  
    
    do {

        if (usersObj.users[i].username === username) {
            console.log('Username Matches'); 
            userFound = true; 
            if (usersObj.users[i].password === password) {
                //Correct login details.
                currentUser = usersObj[i];  

                let jsonString = JSON.stringify(currentUser); 
                localStorage.setItem('userInfo', jsonString); 

                //Determine if the user is a player or a coach (admin)
                
                let xhttp = new XMLHttpRequest(); 
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        console.log('Changing Pages'); 
                        window.location.assign('/userdashboard');
                    } else {
                        console.log('xhttp error occurred', this.status); 
                    }
                }

                xhttp.open("GET", "/user-dashboard", true); 
                xhttp.send(); 
                //window.location.href = '/html-pages/userdashboard.html'; 

            } else {
                incorrectPassword(); 
            }
        }

        i++;
    } while ((i < arrayLength) && (userFound === false)); 

    userFound ? null : incorrectUsername(); //Ternary Operator

}

function getCurrentUser() {
    return currentUser;
}

//Add event listeners
let el = document.getElementById('loginFormButton');
el.addEventListener("click", buttonLoginClick);

export { getCurrentUser }; 

window.onload = getJSONData; 