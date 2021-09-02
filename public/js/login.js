const loginFormHandler = async (event) => {
    event.preventDefault();

    // collect values from the login form
    const email = document.querySelector('#email-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();

    if(email && password){

        // consume the login endpoint with a post request
        const response = await fetch('/api/user/login', {
            method: 'POST',
            body: JSON.stringify({email, password}),
            headers: {'Content-Type':'application/json'}
        });

        if(response.ok){
            console.log('User successfully logged in');
            document.location.replace('/profile');
        } else {
            console.log('User failed to login with known credentials');
            alert(response.statusText);
        }

    } else {
        console.log('User did not submit values for email and password during login');
    }
}

// attach the login handler to the login button
document
.querySelector('.login-form')
.addEventListener('submit', loginFormHandler);