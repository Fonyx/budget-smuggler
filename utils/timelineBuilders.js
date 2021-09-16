const dayjs = require('dayjs');
const {timelineDict} = require('../utils/classes');
const clog = require('../utils/colorLogging');
const date_format = 'DD/MM/YYYY';
var customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

/**
 * Function that creates a balance timeline for a given set of transactions, category filtering is done a level above in the route that calls this
 * @param {int} starting_balance the users opening balance
 * @param {[Objs]} transactions chronologically ordered list of Sequelize objects (note, not serialized in order to use instance methods)
 * @returns {[{date: amount},]} 
 */
async function createBalanceTimelineForAll(starting_balance, transactions){
    
    let data = [];
    var todayObj = dayjs();

    var dayTransactions = createDailyTransactionTotalList(transactions);

    // add today and current balance to the transactions
    dayTransactions.upsert(todayObj.format(date_format), starting_balance);

    // sum all transactions in day
    dayTransactions.reduceValuesLists();

    // sort dictionary keys
    dayTransactions.sort();

    // reduce the transaction totals to an accumulated balance
    dayTransactions.accumulate();

    // export the timeline to a simple object for the graph - tags all elements with their category filter
    data = dayTransactions.export();

    return data;

}


/**
 * Function that creates a balance timeline for a given set of transactions, category filtering is done a level above in the route that calls this
 * @param {int} starting_balance the users opening balance
 * @param {[Objs]} transactions chronologically ordered list of Sequelize objects (note, not serialized in order to use instance methods)
 * @returns {[{date: amount},]} 
 */
async function createBalanceTimelineForAccount(account, transactions){
    
    let data = [];
    var todayObj = dayjs();

    var dayTransactions = createDailyTransactionTotalList(transactions);

    // add today and current balance to the transactions
    dayTransactions.upsert(todayObj.format(date_format), account.balance);

    // sum all transactions in day
    dayTransactions.reduceValuesLists();

    // sort dictionary keys
    dayTransactions.sort();

    // apply compounding to timeline, this happens after sorting as previous values affect
    // dayTransactions.compound(account.interest_rate, account.compounding);

    // sort dictionary keys
    // dayTransactions.sort();

    // reduce the transaction totals to an accumulated balance
    dayTransactions.accumulate();

    // export the timeline to a simple object for the graph - tags all elements with their category filter
    data = dayTransactions.export();

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

    var dayTransactions = new timelineDict();
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
            }
        }
        clog(`Finished frequency analysis for: ${name}`, 'yellow');
    }

    return dayTransactions

}


module.exports = {
    createBalanceTimelineForAll,
    createBalanceTimelineForAccount
}