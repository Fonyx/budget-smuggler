const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const dayjs = require('dayjs');
// https://day.js.org/docs/en/display/format
var weekOfYear = require('dayjs/plugin/weekOfYear')
dayjs.extend(weekOfYear);
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
const clog = require('../utils/colorLogging');
const date_format = 'DD/MM/YYYY';


function getDayMonthMap(year){
    let monthDays;
    // case for a leap year
    if(year % 4 === 0){
        monthDays = {
            'january':[1, 31],
            'february':[32, 60],
            'march':[61, 91],
            'april':[92,121],
            'may':[122, 152],
            'june':[153, 182],
            'july':[183, 213],
            'august':[214, 244],
            'september':[245, 274],
            'october':[275, 305],
            'november':[306, 335],
            'december':[336, 366],
        }
    // case for non leap years
    }else{
        monthDays = {
            'january':[1, 31],
            'february':[32, 59],
            'march':[60, 90],
            'april':[91, 120],
            'may':[121, 151],
            'june':[152, 181],
            'july':[182, 212],
            'august':[213, 243],
            'september':[244, 273],
            'october':[274, 304],
            'november':[305, 334],
            'december':[335, 365],
        }
    }
    return monthDays;
}

/**
 *  function that returns the day of year number for a date object from 0BC, defaults to today if no date parsed
 * @returns {int} a single integer from 0-largeNumber since lots of days since 0BC, + 1 every 4 years for leap year
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

    // add days for leap years, 1 day every 4 years, calculate x and round to floor
    days += Math.floor((yearNumber - 1)/4);

    // calculate number of days in weeks already completed (weeks -1)
    days += (weekNumber-1) * 7

    // add the number of days in current week
    days += dayNumber

    return days
}

/**
     * Converts a day count from 0BC back to a dayjs date obj ie-1000000345 -> dayjs('13/23/2003')
     * @param {int} relDateNum 
     * @return {dayjs()} dayjs object instance
     */
 function convertRelDateToDateObj(relDateNum){
    var result;
    // get date elements back from relDateNum that is relative to 0BC
    // days in a year
    let daysInYear = 365;
    // get the number of years and floor the result to remove the days in the current year
    let year = Math.floor(relDateNum/daysInYear)
    // since we floored above result, determine how many days progressed in current year by finding remainder
    let yearProgressInDays = relDateNum - (365*year);
    // get month and remainder (day of month) and construct new dayjs object
    let progress = convertYearProgressDaysIntoMonth(yearProgressInDays, year);

    result = new dayjs(progress.dayNum+'/'+progress.monthName+'/'+year);

    return result; 
}

/**
 * Converts a year progress day number into a month and a remainder
 * @param {} yearProgressDay 
 */
function convertYearProgressDaysIntoMonth(yearProgressDay, year){
    
    // {monthName:'', dayNum:int}
    var result = {
        monthName:'',
        dayNum:0
    }; 

    // get the mapping for the current year to turn day count into a monthName and remainder
    let dayMap = getDayMonthMap(year);
    /* 
    {
        january: [startInt, endInt],
        ...
    }
    */
    // determine which entry has the corresponding day number
    for(var [monthName, rangeList] of Object.entries(dayMap)){
        // if the yearProgressDay is in the range for this month, save that month, and subtract the month start from the yearProgressDayNum
        let monthStartNum = rangeList[0];
        let monthEndNum = rangeList[1];
        if(monthStartNum <= yearProgressDay && monthEndNum >= yearProgressDay){
            result.monthName = monthName;
            // remove the month start number from the progress number to get the day number inside the month
            result.dayNum = yearProgressDay-monthStartNum;
        }
    }

    return result;
}

class Transaction extends Model {

    getName(){
        return this.getDataValue('name');
    }

    getAmount(){
        let rawAmount = this.getDataValue('amount');
        if(rawAmount){
            let amount = (transaction.getType() === 'income') ? rawAmount : -rawAmount;
            return amount;
        } else {
            return null;
        }
    }

    getDueDateObj(){
        let dueDate = this.getDataValue('due_date');
        if(dueDate){
            return dayjs(dueDate);
        }else{
            return null
        }
    }

    getDueDateString(){
        let dayObj = this.getDueDateObj();
        if(dayObj){
            let dayText = dayObj.format('DD/MM/YYYY');
            return dayText
        } else {
            return null;
        }
    }

    /**
     * Get the day number relative to 0BC from the due date string
     * @returns integer
     */
    getDueDateNum(){
        let date = this.getDueDateObj();
        if(date){
            let dateNum = getDayNumberSince0BC(date);
            return dateNum;
        }else{
            return null
        }
    }

    getFrequency(){
        return this.getDataValue('frequency');
    }

    getType(){
        return this.getDataValue('type');
    }

    getEndRecurrenceObj(){
        let end_recurrence = this.getDataValue('end_recurrence');
        // case for if user has given an end_recurrence date
        if(end_recurrence){
            return dayjs(end_recurrence);
        // case for user not defining and end date, we just assume a year from due date
        } else {
            clog('No end recurrence found, getting date of one year away from start date', 'yellow');
            let dueDateNum = this.getDueDateNum();
            // just extend this end recurrence for a year, it gets recalculated every time the user refreshes the page
            let limitDateNum = dueDateNum + 365;
            // convert dateNum to dayjs obj
            let end_recurrence_limit = convertRelDateToDateObj(limitDateNum);
            return end_recurrence_limit;
        }
    }

    /**
     * Get the day number relative to 0BC from the end recurrence date string
     * @returns integer
     */
    getEndRecurrenceDateNum(){
        let date = this.getEndRecurrenceObj();
        if(date){
            let dateNum = getDayNumberSince0BC(date);
            return dateNum;
        }else{
            clog('No end recurrence date num found, this is an indefinite recurrence')
            return null
        }
    }

    getCategory(){
        return this.getDataValue('category_name');
    }

    getFrequencyMap(){
        const frequencyMap = {
            daily: 1,
            weekly: 6,
            fortnightly: 13,
            annually: 355
        }
        let frequency = this.getFrequency();
        if(frequency != 'once'){
            let days = frequencyMap[this.getFrequency()];
            return days
        } else {
            return null
        }
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
        var resultObjs = [];

        // get dueDateObj
        let dueDateObj = this.getDueDateObj();

        
        // if there is no recurrence for this transaction, it only has one recurring event
        if (this.getFrequency() === 'once'){
            // return list with just dueDateObj in it
            // add dueDateObj to resultant
            resultObjs.push(dueDateObj);
            clog(`Transaction ${this.getName()} is once off`, 'yellow');
            return resultObjs;
        }
        // if transaction repeats monthly
        else if (this.getFrequency() === 'monthly'){
            // add dueDateObj to resultant
            resultObjs.push(dueDateObj);
            // monthly is an exception
            let monthDateObjs = this.getMonthlyRecurrenceDateObjs();
            // append the month dates to the original due date object
            resultObjs =resultObjs.concat(monthDateObjs)
            // if the transaction repeats weekly, fortnightly, or annually
        }else{
            // add dueDateObj to resultant
            resultObjs.push(dueDateObj);
            let otherRecurrenceObs = this.getNonMonthlyRecurrenceDateObjs();
            // append the other dates to the original due date object
            resultObjs = resultObjs.concat(otherRecurrenceObs);
        }
            
        return resultObjs;
    }

    getMonthlyRecurrenceDateObjs(){
        var recurrences = [];

        // get due_date obj
        let startDateObj = this.getDueDateObj();
        // get end_recurrence date obj
        let endDateObj = this.getEndRecurrenceObj();

        // copy dates and set to first day of the month
        let firstOfStartMonthDateObj = startDateObj;
        firstOfStartMonthDateObj.set('date', 1);

        let firstOfEndMonthDateObj = endDateObj;
        firstOfEndMonthDateObj.set('date', 1);

        // determine month count of difference, this will be done with date1.diff(date2, 'month') with no float (this means truncated to an integer) this works because we only ever pass in the first day of the month so always gets a whole month. 
        // #TODO: Check that the month diff can return more than a year as 13 and doesn't just return 1-12, docs are ambiguous
        let monthDiffCount = firstOfEndMonthDateObj.diff(firstOfStartMonthDateObj, 'month');

        // take that month difference from the first of each month and build date objects on the same day number of dueDate Obj for that number of months
        // zero indexing with <= for month difference, as month difference can be 0 and if so, there isn't enough time for a full month between dates given by user so we don't run this loop at all
        let startDayNum = parseInt((startDateObj).format('D'));
        let startMonthNum = parseInt((startDateObj.format('M')));
        let startYearNum = parseInt((startDateObj.format('YYYY')));

        let monthCounter = startMonthNum;
        // we go from the current month, forward to the current month + truncate month difference
        for(let i = startMonthNum; i <= startMonthNum + monthDiffCount; i++){
            // create new dateObj using the startDate day, and programmatically generate the month
            // if we hit 12 months, increment the year
            if(monthCounter >= 12){
                startYearNum += 1;
                monthCounter = 1;
            } else {
                monthCounter += 1;
            }
            let newDateString = startDayNum + '/' + monthCounter + '/' + startYearNum; 
            let newDateObj = dayjs(newDateString, 'DD/M/YYYY');
            recurrences.push(newDateObj);
        }
        /*Note that the user may have over specified the end date, this will be overruled by the coercion of month difference to an integer. User gives date range for 6.5 months but frequency determines only 6 fit, 6 will be made */

        return recurrences;
    }

    getNonMonthlyRecurrenceDateObjs(){
        let recurrenceDateNums = [];
        let recurrenceDateObjs = [];
        // using relative date construction

        // map frequency to day number ie fortnight = 13/14, week = 6/7, annual = 364/365, should these be zero-indexed?
        let frequencyInDays = this.getFrequencyMap();

        // get the starting date day relative to 0BC
        let relStartDayNum = this.getDueDateNum();

        // get the ending date day relative to 0BC
        let relEndDayNum = this.getEndRecurrenceDateNum();

        // if there is no relEndDayNum, user has not defined an end period so we will just extend it for a year
        relEndDayNum = relStartDayNum + 365;

        // make array of relDateNums using the two ranges and the frequency, excluding start as start is already calculated higher and end is round
        /* 
        start: 1000345
        frequency: 13 - fortnightly
        end: 1000371
        ->
        [1000358, 1000371]
        */

        // first number is startNum + frequency step we don't want to add that to the list of recurrences, then increment by frequencyInDays - one too many I think
        for(let i = relStartDayNum + frequencyInDays; i<relEndDayNum; i += frequencyInDays){
            recurrenceDateNums.push(i);
        }

        // now we have a list of relative day numbers, and we need to convert them back to date objects
        recurrenceDateObjs = recurrenceDateNums.map((relDateNum) => {
            return convertRelDateToDateObj(relDateNum)
        });

        //convert relDateNums back to dateObjs
        return recurrenceDateObjs
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
        account_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'account',
                key: 'id',
            },
        }
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
