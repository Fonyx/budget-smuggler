const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const dayjs = require('dayjs');

class Transaction extends Model {

    getDateString(){
        let dayObj = dayjs(this.getDataValue('due_date'));
        let dayText = dayObj.format('DD/MM/YYYY');
        return dayText
    }
    getAmount(){
        return this.getDataValue('amount');
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
