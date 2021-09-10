const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

//https://getbootstrap.com/docs/5.0/utilities/background/
const colors = [
    'bg-primary', 
    'bg-secondary', 
    'bg-success', 
    'bg-danger', 
    'bg-warning', 
    'bg-info', 
    'bg-light',
    'bg-dark',
];

const color_codes = [
    '#0d6efd','#6c757d', '#198754','#dc3545','#ffc107','#0dcaf0', '#f8f9fa','#212529'
]

const color_map = {
    bg_primary: '#0d6efd',
    bg_secondary: '#6c757d',
    bg_success: '#198754',
    bg_danger: '#dc3545',
    bg_warning: '#ffc107',
    bg_info: '#0dcaf0',
    bg_light: '#f8f9fa',
    bg_dark: '#212529'
}

const text_colors = ['text-white', 'text-black'];

const colorsForWhiteText = [
    'bg-primary', 
    'bg-secondary', 
    'bg-success', 
    'bg-danger', 
];

class Category extends Model {}

Category.init(
    {
        name: {
            type: DataTypes.ENUM,
            values:['Cashflow', 'Business', 'Savings', 'Mortgage', 'Crypto'],
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        emoji: {
            // maybe use a hook to determine the emoji char
            type: DataTypes.STRING,
            allowNull: true,
        },
        color :{
            type: DataTypes.ENUM,
            values: color_codes,
            allowNull: false,
        },
        bootstrap_color:{
            type: DataTypes.ENUM,
            values: colors,
            allowNull: false,
        },
        bootstrap_text_color:{
            type: DataTypes.ENUM,
            values: text_colors,
            allowNull: false,
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'category',
    }
);

module.exports = Category;
