// set the minimum date the user can select to be today and onwards
var now = new Date(),
// minimum date the user can choose, in this case now and in the future
minDate = now.toISOString().substring(0,10);

let dueDateEl = document.querySelector('#transaction-due-date');
dueDateEl.setAttribute('min', minDate);