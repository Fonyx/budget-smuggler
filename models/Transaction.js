const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Transaction extends Model { }

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
            type: DataTypes.STRING,
            allowNull: false,
        },
        end_recurrence: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        category_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'category',
                key: 'id',
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
