const jsonFilePath = '/data.json'; 
var usersObj = {}; 
var currentUser = {}; 

function getJSONData () {
    
    fetch(jsonFilePath) 
        .then(response => response.json())
        .then(data => {
            //Process data 
            usersObj = data.users;
            console.log(usersObj);
        })
        .catch(error => {
            console.error('Error Fetching data: ', error); 
        })
    
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
        console.log(usersObj[i]);

        if (usersObj[i].username === username) {
            console.log('Username Matches'); 
            userFound = true; 
            if (usersObj[i].password === password) {
                //Correct login details.
                currentUser = usersObj[i];  

                let jsonString = JSON.stringify(currentUser); 
                localStorage.setItem('userInfo', jsonString); 

                //Determine if the user is a player or a coach (admin)
                
                window.location.href = '/html-pages/userdashboard.html'; 
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