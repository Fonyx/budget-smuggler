const signupFormHandler = async (event) => {
    event.preventDefault();
    // collect values from the login form
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    if (email && password) {

        // consume the login endpoint with a post request
        const response = await fetch('/user/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            headers: { 'Content-Type': 'application/json' }
        });
        if (response.ok) {
            console.log('User successfully logged in');
            document.location.replace('/profile');
        } else if(response.status === 409){
            console.log('That email already exists');
            alert('That email already exists');
        } else {
            console.log('User failed to signup');
            alert(response.statusText);
        }

    } else {
        console.log('User did not submit values for username, email and password during login');
    }
}


// attach the submit handler to the signup button
document
    .querySelector('.signup-form')
    .addEventListener('submit', signupFormHandler);