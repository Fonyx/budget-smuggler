// let dueDateEl = document.getElementById('transaction-due-date');

// dueDateEl.value = new Date().toDateInputValue();

$(document).ready(function() {
    var date = Date();
   $("#transaction-due-date").attr("placeholder",date);
});