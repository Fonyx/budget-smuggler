const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const dayjs = require('dayjs');
// https://day.js.org/docs/en/display/format
var weekOfYear = require('dayjs/plugin/weekOfYear')
dayjs.extend(weekOfYear);

/**
 *  function that returns the day of year number for a date object from 0BC, defaults to today if no date parsed
 * @returns {int} a single integer from 0-largeNumber since lots of days since 0BC
 * */
function getDayNumberSince0BC(date){
    // if parsed a date, use that date
    let dateObj;
    if(date){
        dateObj = dayjs(date);
    // otherwise use today
    }else{
        dateObj = dayjs();
    }
    // get the day number of the date
    let dayNumber = parseInt(dateObj.format('d'), 10);
    // get the week number of the date
    let weekNumber = dateObj.week();
    // get the year number of the date
    let yearNumber = dateObj.format('YYYY');

    // calculate number of days in years already completed (yearNumber - 1)
    let days = (yearNumber - 1) * 365

    // calculate number of days in weeks already completed (weeks -1)
    days += (weekNumber-1) * 7

    // add the number of days in current week
    days += dayNumber

    return days
}

class Transaction extends Model {

    getName(){
        return this.getDataValue('name');
    }
    getAmount(){
        let rawAmount = this.getDataValue('amount');
        let amount = (transaction.getType() === 'income') ? rawAmount : -rawAmount;
        return amount;
    }
    getDueDateObj(){
        return dayjs(this.getDataValue('due_date'));
    }
    getDueDateString(){
        let dayObj = this.getDueDateObj();
        let dayText = dayObj.format('DD/MM/YYYY');
        return dayText
    }
    /**
     * Get the day number relative to 0BC from the due date string
     * @returns integer
     */
    getDueDateNum(){
        let date = this.getDueDateObj();
        let dateNum = getDayNumberSince0BC(date);
        return dateNum;
    }
    getFrequency(){
        return this.getDataValue('frequency');
    }
    getType(){
        return this.getDataValue('type');
    }
    getEndRecurrenceObj(){
        return dayjs(this.getDataValue('end_recurrence'));
    }
    /**
     * Get the day number relative to 0BC from the end recurrence date string
     * @returns integer
     */
     getEndRecurrenceDateNum(){
        let date = this.getEndRecurrenceObj();
        let dateNum = getDayNumberSince0BC(date);
        return dateNum;
    }
    getCategory(){
        return this.getDataValue('category_name');
    }
    getFrequencyMap(){
        const frequencyMap = {
            weekly: 6,
            fortnightly: 13,
            annually: 355
        }
        let days = frequencyMap[this.getFrequency()];
        return days
    }

    /**
     * Function that determines the number of days from today until a date provided, negative means it has passed already
     */
    getDayNumberFromTodayForDate(){
        let todayNumber = getDayNumberSince0BC();
        let targetNumber = getDayNumberSince0BC(this.getDueDate());
        let relativeDays = targetNumber - todayNumber;
        return relativeDays
    }

    /**
     * A function that returns all the recurrences (including initial due date) of this transaction as a list of dayjs objects
     * @returns {[dayjs(),dayjs()]} returns list of string representations of dates
     */
    getAllRecurrenceDateObjs(){

        // create list and add dueDateObj
        var recurrenceDateObjs = [];

        // get dueDateObj
        let dueDateObj = this.getDueDateObj();

        // add dueDateObj to resultant
        recurrenceDateObjs.push(dueDateObj);

        // if there is no recurrence for this transaction, it only has one recurring event
        if (this.getFrequency() === 'once'){
            // return list with just dueDateObj in it
            return recurrenceDateObjs;
        }
        // if transaction repeats monthly
        else if (this.getFrequency() === 'monthly'){
            // monthly is an exception
            let monthDates = this.getMonthlyRecurrenceDateObjs();
            // append the month dates to the original due date object
            recurrenceDateObjs.push(monthDates)
        // if the transaction repeats weekly, fortnightly, or annually
        }else{
            let otherRecurrences = this.getNonMonthlyRecurrenceDateObjs();
            // append the other dates to the original due date object
            recurrenceDateObjs.push(otherRecurrences);
        }
            
        return recurrenceDateObjs;
    }

    getMonthlyRecurrenceDateObjs(){
        var recurrences = [];

        // get due_date obj
        let startDateObj = this.getDueDateObj();
        // get end_recurrence date obj
        let endDateObj = this.getEndRecurrenceObj();

        // create new due date obj for first of that month - including year
        let firstOfStartMonthDateObj = dayjs(startDateObj.format('M/YYYY')); // '3/2021'
        // create new end_recurrence date obj for first of that month - including year
        let firstOfEndMonthDateObj = dayjs(endDateObj.format('M/YYYY')); // '7/2021'

        // determine month count of difference, this will be done with date1.diff(date2, 'month') with no float (this means truncated to an integer) this works because we only ever pass in the first day of the month so always gets a whole month. 
        // #TODO: Check that the month diff can return more than a year as 13 and doesn't just return 1-12, docs are ambiguous
        let monthDiffCount = firstOfEndMonthDateObj.diff(firstOfStartMonthDateObj, 'month');

        // take that month difference from the first of each month and build date objects on the same day number of dueDate Obj for that number of months
        // zero indexing with <= for month difference, as month difference can be 0 and if so, there isn't enough time for a full month between dates given by user so we don't run this loop at all
        let startDayNum = startDateObj.format('D');
        let startMonthNum = startDateObj.format('M');
        let startYearNum = startDateObj.format('YYYY');
        // we go from the current month, forward to the current month + truncate month difference
        for(let i = startMonthNum; i <= startMonthNum + monthDiffCount; i++){
            // create new dateObj using the startDate day, and programmatically generate the month
            // if we hit 12 months, increment the year
            if(i > 12){
                startYearNum += 1;
            }
            let newDateString = startDayNum + '/' + i + '/' + startYearNum; 
            recurrences.push(dayjs(newDateString));
        }
        /*Note that the user may have over specified the end date, this will be overruled by the coercion of month difference to an integer. User gives date range for 6.5 months but frequency determines only 6 fit, 6 will be made */

        return recurrences;
    }
    getNonMonthlyRecurrenceDateObjs(){
        // using relative date construction

        // map frequency to day number ie fortnight = 13/14, week = 6/7, annual = 364/365, should these be zero-indexed?
        let frequencyInDays = this.getFrequencyMap();

        // get the starting date day relative to 0BC
        let relStartDayNum = this.getDueDateNum();

        // get the ending date day relative to 0BC
        let relEndDayNum = this.getEndRecurrenceDateNum();

        // based on transaction type, end_recurence relDateNum, and frequency as a day count
        // build list of relDateNumbers for the transaction period until end_recurrence relDateNum 

        // get end_recurrence relDateNum


        //convert relDateNums back to dateObjs
    }
}   



Transaction.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },  
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                isFloat: true,
            }
        },  
        due_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        frequency: {
            type: DataTypes.ENUM,
            values: ['once','weekly','fortnightly','monthly', 'annually'],
            allowNull: false,
            default: 'once',
        },
        type: {
            type: DataTypes.ENUM,
            values: ['income', 'expense'],
            allowNull: false,
        },
        end_recurrence: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        category_name: {
            type: DataTypes.ENUM,
            values: ['Cashflow', 'Business', 'Savings', 'Mortgage', 'Crypto'],
            allowNull: false,
            references: {
                model: 'category',
                key: 'name',
            },
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id',
            },
        },
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'transaction',
    }
);

module.exports = Transaction;
