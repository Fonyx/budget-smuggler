const createAccountFormHandler = async (event) => {
    event.preventDefault();

    const accountName = document.querySelector('#account-name').value.trim();
    const accountBalance = document.querySelector('#account-balance').value.trim();

    if (accountName && accountBalance) {
        const response = await fetch('/account/create', {
            method: 'POST',
            body: JSON.stringify({ accountName, accountBalance }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            document.location.replace('/account');
        } else {

            alert(response.statusText);
        }

    } else {
        alert('Please enter a name and balance for the account.');
    }
}
document.querySelector('.update-balance-form').addEventListener('submit', createAccountFormHandler);