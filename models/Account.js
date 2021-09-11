const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

const colors = [
    'red', 
    'pink', 
    'purple', 
    'deep-purple', 
    'indigo',
    'blue',
    'light-blue',
    'cyan',
    'teal',
    'green',
    'light-green',
    'lime',
    'yellow',
    'amber',
    'orange',
    'deep-orange',
    'brown',
    'grey',
]
const modifiers = [
    'lighten-5', 
    'lighten-4', 
    'lighten-3', 
    'lighten-2', 
    'lighten-1',
    '',
    'darken-1',
    'darken-2',
    'darken-3',
    'darken-4',
    'accent-1',
    'accent-2',
    'accent-3',
    'accent-4',
]

// a function that returns a random int inclusively between min and max
function generateRandomIntFromRange(min, max){
    return Math.floor(Math.random()*(max-min+1)+min);
}

class Account extends Model {}

Account.init(
    {
        id:{
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true,
            allowNull:false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [2,5],
            },
        },
        balance:{
            type: DataTypes.FLOAT,
            defaultValue: 0.00,
            validate:{
                isFloat: true,
            }
        },
        emoji: {
            // maybe use a hook to determine the emoji char
            type: DataTypes.STRING,
            allowNull: true,
        },
        materialize_color:{
            type: DataTypes.ENUM,
            values: colors,
            allowNull: false,
        },
        materialize_modifier:{
            type: DataTypes.ENUM,
            values: modifiers,
            allowNull: false,
        },
        materialize_text_color:{
            type: DataTypes.ENUM,
            values: ['white', 'black'],
            allowNull: false,
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id',
            },
        }
    },{
    hooks:{
        beforeCreate: (account) => {
            let randomColorIndex = generateRandomIntFromRange(0, colors.length-1);
            let randomModifierIndex = generateRandomIntFromRange(0, modifiers.length-1);
            let materializeText = 'black'

            let randomColor = colors[randomColorIndex];
            let randomModifier = modifiers[randomModifierIndex];

            account.materialize_color = randomColor;
            account.materialize_modifier = randomModifier;

            // if the modifier is darken, set the text to white, otherwise leave it black for lighten and accent
            if(randomModifier[0] === 'd'){
                materializeText = 'white';
            }
            account.materialize_text_color = materializeText;
        }
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'category',
    }
);

module.exports = Category;
