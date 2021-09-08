const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const moment = require('../node_modules/moment/dist/moment');

class Transaction extends Model { 

    getDueDateAsDateString(){
        return moment(this.getDataValue('due_date')).format('DD/MM/YYYY');
        // return moment(this.getDataValue('createdAt')).format('DD/MM/YYYY h:mm:ss');
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
