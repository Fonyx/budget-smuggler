const dayjs = require('dayjs');
var weekOfYear = require('dayjs/plugin/weekOfYear')
dayjs.extend(weekOfYear);
const {Dict} = require('../utils/classes');

/**
 * Function that creates a balance timeline for a given set of transactions and filters for category for the next year.
 * @param {int} starting_balance the users opening balance
 * @param {[Objs]} transactions chronologically ordered list of Sequelize objects (note, not serialized in order to use instance methods)
 * @param {str} category str for category filter or 'all'
 * @returns {[{date: amount},]} 
 */
async function createBalanceTimeline(starting_balance, transactions, category){
    // Entire function revolves around day numbers from today forward 365 days

    const allowedCategories = ['all', 'business', 'cashflow', 'savings'];

    // check the category is valid
    if(allowedCategories.includes(category)){

        // calculate day0 balance and assign
        var dateAmounts = [];
        // push the day 0 value
        dateAmounts.push(
            {0: starting_balance}
        )
        var dayBalances = createDayTransactionList(transactions)

        // build new array of length 365 with total balance on each day

    } else {
        throw new Error(`Timeline builder received invalid category ${category}, must be in ${allowedCategories}`);
    }

}

/**
 * Function that builds an array of date:transaction based on a list of transactions, this list is not unique as there may be multiple transactions on a day
 * returns a list of date:transaction 
* [day_1: [
*      200, -150, 500
*       ],
* day_2:[
*      100, -240, 200
*       ],
 * day_3 :[
 *      
 *      ]
 * ...]
 */
function createDayTransactionList(transactions){

    var dayTransactions = new Dict();

    // create array of income/expenses
    for(transaction of transactions){
        // get the relative day number of each transaction and store with amount (+- according to transaction type)
        let amount = transaction.getAmount();
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
        }
    }
    dayTransactions.reduceValuesLists();
    dayTransactions.print();

    return dayTransactions

}


module.exports = {
    createBalanceTimeline,
}