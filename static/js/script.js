var userInfo = {}; 

function getUserInfo() {
  userInfo = localStorage.getItem('userInfo'); 
  console.log(userInfo); 
}

window.onload = getUserInfo; 