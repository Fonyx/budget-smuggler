const createAccountFormHandler = async (event) => {
    event.preventDefault();

    const name = document.querySelector('#account-name').value.trim();
    const balance = document.querySelector('#account-balance').value.trim();
    const interest_rate = document.querySelector('#account-interest-rate').value.trim();
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
    
    if(!name){
        feedback.textContent = "You need an account name";
        return
    }

    if(!interest_rate || interest_rate < 0){
        feedback.textContent = "You need to have a positive interest rate";
        return
    }

    const response = await fetch('/account/create', {
        method: 'POST',
        body: JSON.stringify({ name, balance, interest_rate }),
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
        document.location.replace('/profile/all');
    }else if(response.status === 409){
        feedback.textContent = "You already have an account with that name";
        return
    } else {
        alert(response.statusText);
    }
}
document.querySelector('.update-account-form')
.addEventListener('submit', createAccountFormHandler);