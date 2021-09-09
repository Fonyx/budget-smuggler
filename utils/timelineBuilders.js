const dayjs = require('dayjs');
const {dict} = require('../utils/classes');
const clog = require('../utils/colorLogging');

/**
 * Function that creates a balance timeline for a given set of transactions, category filtering is done a level above in the route that calls this
 * @param {int} starting_balance the users opening balance
 * @param {[Objs]} transactions chronologically ordered list of Sequelize objects (note, not serialized in order to use instance methods)
 * @returns {[{date: amount},]} 
 */
async function createBalanceTimeline(starting_balance, transactions){
    
    // calculate day0 balance and assign
    var dateAmounts = [];
    let data = [];
    // push the day 0 value
    dateAmounts.push(
        {0: starting_balance}
    )

    var dayTransactionTotals = createDailyTransactionTotalList(transactions);

    // reduce the transaction totals to an accumulated balance
    dayTransactionTotals.accumulate();

    // export the timeline to a simple object for the graph
    data = dayTransactionTotals.export();

    return data;

}

/**
 * Function that builds an array of 'date:total_for_daily_transactions' based on a list of transactions
 * returns a dictionary with a list for values
 [
    day_1: [200],
    day_2:[100],
    day_3 :[-300]
  ]
 */
function createDailyTransactionTotalList(transactions){

    var dayTransactions = new dict();

    // create array of income/expenses
    for(transaction of transactions){
        // get the relative day number of each transaction and store with amount (+- according to transaction type)
        let amount = transaction.getAmount();
        let name = transaction.getName();
        // get the number of days in the future from today
        let relativeDate = transaction.getDayNumberFromTodayForDate();
        let due_date = transaction.getDateString();
        // past date filter
        if(relativeDate > 0){
            // date is yet to come so we care about it
            // we are going to implement a dictionary from python here
            dayTransactions.upsert(due_date, amount);
        } else {
            // date has already passed
            clog(`Transaction ${name} already past: ${due_date}`,'blue')
        }
    }
    dayTransactions.reduceValuesLists();

    return dayTransactions

}


module.exports = {
    createBalanceTimeline,
}