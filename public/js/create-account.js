const createAccountFormHandler = async (event) => {
    event.preventDefault();

    const name = document.querySelector('#account-name').value.trim();
    const balance = document.querySelector('#account-balance').value.trim();

    if (name && balance) {
        const response = await fetch('/account/create', {
            method: 'POST',
            body: JSON.stringify({ name, balance }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            document.location.replace('/profile');
        } else {
            console.log(response);
            alert(response.statusText);
        }

    } else {
        alert('Please enter a name and balance for the account.');
    }
}
document.querySelector('.update-balance-form').addEventListener('submit', createAccountFormHandler);