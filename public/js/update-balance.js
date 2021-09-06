const updateBalanceFormHandler = async (event) => {
    event.preventDefault();
    // collect values from the login form
    const balance = document.querySelector('#current-balance').value.trim();

    if(balance){

        // consume the login endpoint with a post request
        const response = await fetch('/user/balance', {
            method: 'PUT',
            body: JSON.stringify({username, email, password}),
            headers: {'Content-Type':'application/json'}
        });

        if(response.ok){
            console.log('User balance successfully retrieved');
            // document.location.replace('/profile');
        } else {
            console.log('User current balance not retrieved');
            alert(response.statusText);
        }

    } else {
        console.log('User did not submit values for current balance');
    }
}


// attach the submit handler to the signup button
document
.querySelector('.update-balance-form')
.addEventListener('submit', updateBalanceFormHandler);