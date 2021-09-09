const createTransactionHandler = async (event) => {
    event.preventDefault();

    const name = document.querySelector('#transaction-name').value.trim();
    const amount = document.querySelector('#transaction-amount').value.trim();
    const frequency = document.querySelector('input[name="transaction-type"]:checked').value;
    const category = document.querySelector('#transaction-category').value.trim();
    const dueDate = document.querySelector('#transaction-duedate').value.trim();
    const frequency = document.querySelector('input[name="transaction-frequency"]:checked').value;
    const endDate = document.querySelector('#transaction-enddate').value.trim();
}





