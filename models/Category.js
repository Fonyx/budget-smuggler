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

class Category extends Model {}

Category.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            primaryKey: true,
            unique: true
        },
        colour: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        emoji: {
            // maybe use a hook to determine the emoji char
            type: DataTypes.STRING,
            allowNull: true,
        },
        bootstrap_color:{
            type: DataTypes.ENUM,
            values: colors,
            allowNull: false,
        },
        bootstrap_modifier:{
            type: DataTypes.ENUM,
            values: modifiers,
            allowNull: false,
        },
        bootstrap_text_color:{
            type: DataTypes.ENUM,
            values: ['white', 'black'],
            allowNull: false,
        }
    },
    {
        hooks:{
            beforeCreate: (tag) => {
                let randomColorIndex = generateRandomIntFromRange(0, colors.length-1);
                let randomModifierIndex = generateRandomIntFromRange(0, modifiers.length-1);
                let bootstrapText = 'black'
    
                let randomColor = colors[randomColorIndex];
                let randomModifier = modifiers[randomModifierIndex];
    
                tag.bootstrap_color = randomColor;
                tag.bootstrap_modifier = randomModifier;
    
                // if the modifier is darken, set the text to white, otherwise leave it black for lighten and accent
                if(randomModifier[0] === 'd'){
                    bootstrapText = 'white';
                }
                tag.bootstrap_text_color = bootstrapText;

                // store the tag name as a hyphenated slug to avoid spaces in urls
                tag.name = tag.name.replace(' ', '-');
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
