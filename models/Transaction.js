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
    getDateString(){
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
            type: DataTypes.STRING,
            allowNull: false,
            default: "once",
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
            type: DataTypes.STRING,
            allowNull: false,
            references: {
                model: 'category',
                key: 'name',
            },
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
