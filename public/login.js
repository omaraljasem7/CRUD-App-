const usernameInput=document.getElementById('username');
const passwordInput=document.getElementById('password');
const loginBtn=document.getElementById('login-btn');
const errorDiv=document.getElementById('error-message');
function showError(message){
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

loginBtn.addEventListener('click', () => {
    errorDiv.style.display = 'none';
    const username=usernameInput.value.trim();
    const password =passwordInput.value.trim();
    if(!username || !password){
        showError("please fill all fields");
        return;
    }
    fetch('/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({username,password})
    })
        .then( (response)=> {
            if(!response.ok){
                return response.json().then((err) => {
                    throw new Error(err.error)
                })
            }
            return response.json();
        })
        .then((data)=>{
            localStorage.setItem('token',data.token);
            window.location.href='index.html';
        })
        .catch((err)=>{
            showError(err.message);
        })
})

function myFunction() {
    var x = document.getElementById("password");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}