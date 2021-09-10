console.log("infile")
const updateBalanceFormHandler = async (event) => {
    console.log("infunction")
    event.preventDefault();
    // collect values from the update-balance form
    const balance = document.querySelector('#current-balance').value.trim();
    
    if(balance){
        try{
            // consume the login endpoint with a post request
            const response = await fetch(`/profile/balance`, {
                method: 'PUT',
                body: JSON.stringify({balance}),
                headers: {'Content-Type':'application/json'}
            });
            if(response.ok){
                console.log('User balance successfully retrieved');
                document.location.replace('/profile');
            } else if (response.statusCode === 400) {
                    alert('Client error');
            } else if (response.statusCode === 500) {
                    alert('Server error');
            } else {
                console.log('User current balance not retrieved');
                alert(response.statusText);
            }
        } catch(err){
            console.log(err)
        }
    } else {
        console.log('User did not submit values for current balance');
    }
}

// attach the submit handler to the signup button
document
.querySelector('.update-balance-form')
.addEventListener('submit', updateBalanceFormHandler);