console.log("infile")
const updateTransactionFormHandler = async (event) => {
    console.log("infunction")
    event.preventDefault();
    // collect values from the update-transaction form
    const name = document.querySelector('#update-transaction-name').value.trim();
    const amount = document.querySelector('#update-transaction-amount').value.trim();
    const dueDate = document.querySelector('#update-transaction-due-date').value.trim();
    const frequency = document.querySelector('#update-transaction-frequency').value.trim();
    const type = document.querySelector('#update-transaction-type').value.trim();
    const category_name = document.querySelector('#update-transaction-category-name').value.trim();    
    //Unsure about line 15. 
    const transactionObj = document.querySelector('#update-transaction-form').dataset.id;

    if(name & amount & dueDate & frequency & type & category_name){
        try{
            // consume the login endpoint with a post request
            const response = await fetch(`/transaction/update/${transactionObj.id}`, {
                method: 'PUT',
                body: JSON.stringify({name, amount, dueDate, frequency, type, endRecurrence, category_name}),
                headers: {'Content-Type':'application/json'}
            });
            if(response.ok){
                console.log('User transaction successfully retrieved');
                //document.location.replace('/profile');
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
    } else {
        console.log('User did not submit values for current transaction');
    }
}

// attach the submit handler to the signup button
document
.querySelector('#update-transaction-form')
.addEventListener('submit-btn', updateTransactionFormHandler);