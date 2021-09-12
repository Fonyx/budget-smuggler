const createTransactionHandler = async (event) => {
    event.preventDefault();
    const nameValue = document.querySelector('#transaction-name').value.trim();
    const amountValue = document.querySelector('#transaction-amount').value.trim();
    const typeValue = document.querySelector('input[name="transaction-type"]:checked').value;
    const accountId = document.querySelector('input[name="transaction-account"]:checked').dataset.id;
    const dueDateValue = document.querySelector('#transaction-duedate').value.trim();
    const frequencyValue = document.querySelector('input[name="transaction-frequency"]:checked').value;
    const endDateValue = document.querySelector('#transaction-enddate').value.trim();

    // validating user input for amountValue
    try {
        let _ = parseFloat(amountValue);
    } catch (err) {
        console.error(err);
        return
    }

    // validating that dueDate has been filled out
    if(!dueDateValue){
        console.error(err);
        return
    }

    let data_packet = {
        'name': nameValue,
        'amount': amountValue,
        'due_date': new Date(dueDateValue),
        'frequency': frequencyValue,
        'type': typeValue,
        'end_recurrence': new Date(endDateValue),
        'account_id': accountId,
    }

    console.log('Sending date to server',data_packet);

    const response = await fetch(`/transaction`, {
        method: 'POST',
        body: JSON.stringify(data_packet),
        headers: { 'Content-Type': 'application/json' }
    });

    if (response.ok) {
        document.location.replace('/profile');
    } else {
        console.log(response);
        alert('Failed to create transaction');
    }

}

document.querySelector('#create-transaction-form').addEventListener('submit', createTransactionHandler);








