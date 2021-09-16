const updateTransactionFormHandler = async (event) => {
    event.preventDefault();
    const nameValue = document.querySelector('#transaction-name').value.trim();
    const amountValue = document.querySelector('#transaction-amount').value.trim();
    const typeValue = document.querySelector('input[name="transaction-type"]:checked').value;
    const accountId = document.querySelector('input[name="transaction-account"]:checked').dataset.id;
    const dueDateValue = document.querySelector('#transaction-due-date').value.trim();
    const frequencyValue = document.querySelector('input[name="transaction-frequency"]:checked').value;
    const endDateValue = document.querySelector('#transaction-end-date').value.trim();   
    const transaction_id = document.querySelector('#transaction-name').dataset.id;
    console.log(transaction_id);
    try {
        let _ = parseFloat(amountValue);
    } catch (err) {
        console.error(err);
        return
    }

    // validating that dueDate has been filled out
    if(!dueDateValue){
        console.error('You need to enter a due date');
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

    console.log(data_packet);
    
    // if(name & amount & dueDate & frequency & type & category_name & transaction_id){
        try{
            // consume the login endpoint with a post request
            const response = await fetch(`/transaction/update/${transaction_id}`, {
                method: 'PUT',
                body: JSON.stringify(data_packet),
                headers: {'Content-Type':'application/json'}
            });
            if(response.ok){
                console.log('User transaction successfully updated');
                document.location.replace('/profile/all');
            } else if (response.statusCode === 400) {
                    alert('Client error');
            } else if (response.statusCode === 500) {
                    alert('Server error');
            } else {
                console.log('User current transaction not retrieved');
                alert(response.statusText);
            }
        } catch(err){
            console.log(err)
        }
}

// attach the submit handler to the signup button
document
.querySelector('#update-transaction-form')
.addEventListener('submit', updateTransactionFormHandler);