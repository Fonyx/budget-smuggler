const clog = require('./colorLogging');


/* A collection of cleaning functions

 Rule of thumb, these are used for any string checking you need to do. They have a clean boolean return
 and are the underlying logic for validators which have a mixed return for sequelize validation
*/

/**
 * A function that validates every element of a string is an alphabet character or a space, upper and lower case is supported. See test case for more details
 * @param {str} text list of characters
 * @returns boolean
 */
function stringSpacesNoNumbers(text){
    if(typeof(text) !== 'string'){
        clog(`Type must be string, not ${typeof(text)}`, 'red');
        return false;
    }
    for(let i=0; i < text.length; i++){
        let current = text[i];
        let textMatch = /[a-z A-Z]/g;
        let valid = textMatch.test(current);
        if(!valid){
            clog('Only alphabet and space is allowed', 'red');
            return false
        }
    }
    return true;
}

/**
 * A function that validates something only contains characters, excludes numbers and special characters
 * @param {str} text list of characters
 * @returns boolean
 */
function stringCharsOnly(userText){
    // if the type of the user text is not a string
    if(typeof(userText) !== 'string'){
        clog(`Did not receive string as input, received: ${typeof(userText)}`,'red');
        return false;
    } else {
        // if receives empty string - console log but still return true
        if(userText === ''){
            clog('STRANGE REQUEST - Asked to verify empty string for characters only - DOING NOTHING', 'red');
            return true;
        }
    }
    // loop through every character in the input
    for(let i =0; i< userText.length; i++){
        // get current character
        let currentChar = userText[i];
        try{
            // check that we can't turn the userText into a number
            if(parseInt(currentChar, 10)){
                clog(`Found an integer: ${currentChar} in input: ${userText}`, 'red');
                return false;
            }
        } catch {
            // do nothing because we expect parseInt to fail when it encounters a character
        }
        // check for special characters
        let badFormat = /[`!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~]/;
        if(badFormat.test(currentChar)){
            clog(`Found a special character: ${currentChar} in input: ${userText}`, 'red');
        }
    }
    // if nothing else threw a failure error, then return true as string must only contain alpha/space chars
    return true;
}

/**
 * A function that checks only contains integers
 * @param {str} text list of integers
 * @returns boolean
 */
function stringOfIntOnly(userText){
    // quick check of if userText fails to be turned into an int
        if(isNaN(parseInt(userText, 10))){
            clog(`User text: ${userText} could not be parsed as integer}`, 'red');
            return false;
        } else {
            // check for hex issues i.e number is 12b5 which can be turned into an int, 
            //so we confirm every element is an int
            for(let i=0; i<userText.length;i++){
                if(isNaN(parseInt(userText.charAt(i)))){
                    return false;
                }
            }
        }
        return true
}

const cleaners = {
    stringSpacesNoNumbers,
    stringCharsOnly,
    stringOfIntOnly,
}

module.exports = cleaners;
