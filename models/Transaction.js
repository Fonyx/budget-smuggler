const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const dayjs = require('dayjs');
// https://day.js.org/docs/en/display/format
var weekOfYear = require('dayjs/plugin/weekOfYear')
dayjs.extend(weekOfYear);


// function that returns the day of year number for a date object, defaults to today
function getAnnualDayNumber(date){
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
    getDueDate(){
        return this.getDataValue('due_date');
    }
    getDueDateString(){
        let dayObj = dayjs(this.getDataValue('due_date'));
        let dayText = dayObj.format('DD/MM/YYYY');
        return dayText
    }
    getFrequency(){
        return this.getDataValue('frequency');
    }
    getType(){
        return this.getDataValue('type');
    }
    getEndRecurrence(){
        return this.getDataValue('end_recurrence');
    }
    getCategory(){
        return this.getDataValue('category_name');
    }

    /**
     * Function that determines the number of days from today until a date provided, negative means it has passed already
     */
    getDayNumberFromTodayForDate(){
        let todayNumber = getAnnualDayNumber();
        let targetNumber = getAnnualDayNumber(this.getDueDate());
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

        // if frequency === 'once'
            // return list with just dueDateObj in it

        // else if (frequency === 'monthly)
            // monthly is an exception
            // this.getMonthlyRecurrenceDateObjs();
            
        // else
            // this.getNonMonthlyRecurrenceDateObjs();
            // get end_recurrence reldateNum
            // map frequency to day number ie fortnight = 13/14, week = 6/7, annual = 364/365, should these be zero-indexed?
            // based on transaction type, end_recurence relDateNum, and frequency as a day count
            // build list of relDateNumbers for the transaction period until end_recurrence relDateNum 
            
            return dateStrings
        }
    

        getMonthlyRecurrenceDateObjs(){
        // get end_recurrence reldateNum

        getNonMonthlyRecurrenceDateObjs(){

        }
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
