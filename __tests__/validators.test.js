const validators = require('../utils/validators');

describe('Testing string spaces no number validator', () =>{
    describe('Testing happy path with valid strings', ()=>{
        it('Should return true when upper case string passed', ()=>{
            let testString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let result = validators.stringSpacesNoNumbersValidator(testString);
            expect(result).toBe(true);
        }),
        it('Should return true when lower case string passed', ()=>{
            let testString = 'abcdefghijklmnopqrstuvwxyz';
            let result = validators.stringSpacesNoNumbersValidator(testString);
            expect(result).toBe(true);
        }),
        it('Should return true when mixed case spacious string passed', ()=>{
            let testString = 'This is a valid test string';
            let result = validators.stringSpacesNoNumbersValidator(testString);
            expect(result).toBe(true);
        })
    });
    
    describe('Testing unhappy paths', ()=> {
        it('Should return a string if string with number in it', ()=>{
            let testString = 'asbweroin3werfv';
            let result = validators.stringSpacesNoNumbersValidator(testString);
            expect(result).not.toBe(true);
        }),
        it('Should return a string if string contains non space special character', ()=>{
            let testString = 'asbweroin&%$';
            let result = validators.stringSpacesNoNumbersValidator(testString);
            expect(result).not.toBe(true);
        }),
        it('Should return a string if non string passed in', ()=>{
            let testString = ['Bad structure'];
            let result = validators.stringSpacesNoNumbersValidator(testString);
            expect(result).not.toBe(true);
        })
    });
});