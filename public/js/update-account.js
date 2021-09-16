const updateBalanceFormHandler = async (event) => {
    event.preventDefault();
    // collect values from the update-balance form
    const nameValue = document.querySelector('#account-name').value.trim();
    const balance = document.querySelector('#account-balance').value.trim();
    const interest_rate = document.querySelector('#account-interest-rate').value.trim();
    const account_id = document.querySelector('#account-detail').dataset.id;
    const feedback = document.querySelector('#feedback');

    try {
        let _ = parseFloat(balance);
    } catch (err) {
        feedback.textContent = "You need to add a decimal number as a balance";
        console.error(err);
        return
    }

    try {
        let __ = parseFloat(interest_rate);
    } catch (err) {
        feedback.textContent = "You need to add a decimal number as a balance";
        console.error(err);
        return
    }
    
    if(!nameValue){
        feedback.textContent = "You need an account name";
        return
    }

    let name = nameValue.toLowerCase().replace(/ /g, '-');

    if(!interest_rate || interest_rate < 0){
        feedback.textContent = "You need to have a positive interest rate";
        return
    }

    
    if(balance && account_id && name && interest_rate){
        try{
            // consume the login endpoint with a post request
            const response = await fetch(`/account/update/${account_id}`, {
                method: 'PUT',
                body: JSON.stringify({balance, name, interest_rate}),
                headers: {'Content-Type':'application/json'}
            });
            if(response.ok){
                console.log('User balance successfully updated');
                document.location.replace(`/profile/account/${name}`);
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
.querySelector('.update-account-form')
.addEventListener('submit', updateBalanceFormHandler);