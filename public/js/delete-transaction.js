console.log('infile');
const deleteCommentFormHandler = async (event) => {
    console.log('infunction');
    event.preventDefault();

    // collect values from the login form
    const transaction_id = document.querySelector('#delete').dataset.transaction_id;
    console.log(transaction_id);
    // consume the login endpoint with a post request
    const response = await fetch(`/transaction/delete/${transaction_id}`, {
        method: 'DELETE',
        headers: {'Content-Type':'application/json'}
    });

    if(response.ok){
        console.log('Post deleted successfully');
        document.location.replace(`/profile/all`);
    } else {
        console.log('Post failed to delete');
        alert(response.statusText);
    }
}

// attach the submit handler to the signup button
document
.querySelector('#delete')
.addEventListener('click', deleteCommentFormHandler);