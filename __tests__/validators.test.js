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

describe('Testing string chars only validator', () =>{
    describe('Testing happy path with valid strings', ()=>{
        it('Should return true when upper case string passed', ()=>{
            let testString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            let result = validators.stringCharsOnlyValidator(testString);
            expect(result).toBe(true);
        }),
        it('Should return true when lower case string passed', ()=>{
            let testString = 'abcdefghijklmnopqrstuvwxyz';
            let result = validators.stringCharsOnlyValidator(testString);
            expect(result).toBe(true);
        }),
        it('Should return true when mixed case spacious string passed', ()=>{
            let testString = 'ThisIsStillValid';
            let result = validators.stringCharsOnlyValidator(testString);
            expect(result).toBe(true);
        })
    });
    
    describe('Testing unhappy paths', ()=> {
        it('Should return a string if string with number in it', ()=>{
            let testString = 'asbweroin3werfv';
            let result = validators.stringCharsOnlyValidator(testString);
            expect(result).toBe('asbweroin3werfv contains a non char value');
        }),
        it('Should return a string if string contains special character', ()=>{
            let testString = 'asbweroin&%$';
            let result = validators.stringCharsOnlyValidator(testString);
            expect(result).toBe('asbweroin&%$ contains a non char value');
        }),
        it('Should return a string if non string passed in', ()=>{
            let testString = ['Bad structure'];
            let result = validators.stringCharsOnlyValidator(testString);
            expect(result).not.toBe(true);
        })
    });
});

describe('Testing string int only validator', () =>{
    describe('Testing happy path with valid string of ints', ()=>{
        it('Should return true when list of ints passed', ()=>{
            let testString = '1234567';
            let result = validators.stringOfIntOnlyValidator(testString);
            expect(result).toBe(true);
        }),
        it('Should return true when single integer passed', ()=>{
            let testString = '3';
            let result = validators.stringOfIntOnlyValidator(testString);
            expect(result).toBe(true);
        })
    });
    
    describe('Testing unhappy paths', ()=> {
        it('Should return a string if string with a number in it passed', ()=>{
            let testString = 'asbweroin3werfv';
            let result = validators.stringOfIntOnlyValidator(testString);
            expect(result).toBe('asbweroin3werfv contains a non int value');
        }),
        it('Should return a string if string no numbers', ()=>{
            let testString = 'asbweroin&%$';
            let result = validators.stringOfIntOnlyValidator(testString);
            expect(result).toBe('asbweroin&%$ contains a non int value');
        }),
        it('Should return a string if non string passed in', ()=>{
            let testString = ['Bad structure'];
            let result = validators.stringOfIntOnlyValidator(testString);
            expect(result).not.toBe(true);
        })
    });
});