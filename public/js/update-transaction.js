const updateTransactionFormHandler = async (event) => {
    event.preventDefault();
    // collect values from the update-transaction form
    const nameValue = document.querySelector('#update-transaction-name').value.trim();
    const amountValue = document.querySelector('#update-transaction-amount').value.trim();
    const dueDateValue = document.querySelector('#update-transaction-due-date').value.trim();
    const frequencyValue = document.querySelector('#update-transaction-frequency').value.trim();
    const typeValue = document.querySelector('#update-transaction-type').value.trim();
    const categoryNameValue = document.querySelector('#update-transaction-category-name').value.trim();    

    const transaction_id = document.querySelector('#update-transaction-name').dataset.id;

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
        'dueDate': dueDateValue,
        'frequency': frequencyValue,
        'type': typeValue,
        'category': categoryNameValue,
    }
    
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
                document.location.replace('/profile');
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
    // } else {
    //     console.log('User did not submit values for current transaction');
    // }
}

// attach the submit handler to the signup button
document
.querySelector('#update-transaction-form')
.addEventListener('submit', updateTransactionFormHandler);