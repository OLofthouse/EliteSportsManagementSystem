const jsonFilePath = '/data.json'; 


function buttonLoginClick() {
    //Validate the login information 
    let username = document.getElementById('loginUsername').value; 
    let password = document.getElementById('loginPassword').value; 
}



//Add event listeners
let el = document.getElementById('loginForm');
el.addEventListener("click", buttonLoginClick);