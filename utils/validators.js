const clog = require('./colorLogging');
const cleaners = require('./cleaners');

/* A collection of sequelize validators

    Validators either return true, or return a string message for failure, 
    this is a mixed return and should not be used for anything other than sequelize validation

 Note the only difference between a validator and cleaner is that a cleaner 
 returns a boolean and console logs details of a failure, where as a validator has a 
 mixed return  (true or string).


 */

function stringSpacesNoNumbersValidator(text){
    let pass = cleaners.stringSpacesNoNumbers(text)
    if(pass){
        return true;
    } else {
        return `${text} contains a character that is not a char or contains a non space special character`;
    }
}

function stringCharsOnlyValidator(text){
    let pass = cleaners.stringCharsOnly(text)
    if(pass){
        return true;
    } else {
        return `${text} contains a non char value`;
    }
}

function stringOfIntOnlyValidator(text){
    let pass = cleaners.stringOfIntOnly(text)
    if(pass){
        return true;
    } else {
        return `${text} contains a non int value`;
    }
}


const validators = {
    stringSpacesNoNumbersValidator,
    stringCharsOnlyValidator,
    stringOfIntOnlyValidator,
}

module.exports = validators;