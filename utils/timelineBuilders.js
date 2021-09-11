const dayjs = require('dayjs');
const {dict} = require('../utils/classes');
const clog = require('../utils/colorLogging');
const date_format = 'DD/MM/YYYY';

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

    // sum all transactions in day
    dayTransactionTotals.reduceValuesLists();

    // sort dictionary keys
    dayTransactionTotals.sort();

    // reduce the transaction totals to an accumulated balance
    dayTransactionTotals.accumulate(starting_balance);

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
    var todayObj = dayjs();

    // create array of income/expenses
    for(transaction of transactions){
        // get the relative day number of each transaction and store with amount (+- according to transaction type)
        let amount = transaction.getAmount();
        let name = transaction.getName();
        let recurrenceDateObjs = transaction.getAllRecurrenceDateObjs();

        for(let recurrenceDate of recurrenceDateObjs){
            if(recurrenceDate.diff(todayObj) > 0){
                // date is yet to come so we care about it
                // we are going to implement a dictionary from python here
                dayTransactions.upsert(recurrenceDate.format(date_format), amount);
            } else {
                // date has already passed - log it for sanity but do nothing else
                // clog(`Transaction ${name} recurrence date: ${recurrenceDate.format(date_format)} has already passed`,'blue')
            }
        }
        clog(`Finished frequency analysis for: ${name}`, 'yellow');
    }

    return dayTransactions

}


module.exports = {
    createBalanceTimeline,
}