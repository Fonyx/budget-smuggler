const clog = require('./colorLogging');

/**
 * A function that validates every element of a string is an alphabet character or a space, upper and lower case is supported. See test case for more details
 * @param {str} text list of characters
 * @returns none or throw
 */
 function stringSpacesNoNumbersValidator(text){
    if(typeof(text) !== 'string'){
        throw new Error(`Type must be string, not ${typeof(text)}`);
    }
    for(let i=0; i < text.length; i++){
        let current = text[i];
        let textMatch = /[a-z A-Z]/g;
        let valid = textMatch.test(current);
        if(!valid){
            clog('Only alphabet and space are allowed', 'red');
            throw new Error('Only alphabet and space are allowed');
        }
    }
}

const validators = {
    stringSpacesNoNumbersValidator,
}

module.exports = validators;