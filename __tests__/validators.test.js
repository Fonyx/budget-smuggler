const validators = require('../utils/customSqlValidators');

describe('Testing string spaces no number validator', () =>{
    describe('Testing happy path with valid strings', ()=>{
        it('Should return true when upper case string passed', ()=>{
            let testString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            expect(()=>{
                let _ = validators.stringSpacesNoNumbersValidator(testString);
            }).not.toThrow();
        }),
        it('Should return true when lower case string passed', ()=>{
            let testString = 'abcdefghijklmnopqrstuvwxyz';
            expect(()=>{
                let _ = validators.stringSpacesNoNumbersValidator(testString);
            }).not.toThrow();
        }),
        it('Should return true when mixed case spacious string passed', ()=>{
            let testString = 'This is a valid test string';
            expect(()=>{
                let _ = validators.stringSpacesNoNumbersValidator(testString);
            }).not.toThrow();
        })
    });
    
    describe('Testing unhappy paths', ()=> {
        it('Should return a string if string with number in it', ()=>{
            let testString = 'asbweroin3werfv';
            expect(()=>{
                let _ = validators.stringSpacesNoNumbersValidator(testString);
            }).toThrow();
        }),
        it('Should return a string if string contains non space special character', ()=>{
            let testString = 'asbweroin&%$';
            expect(()=>{
                let _ = validators.stringSpacesNoNumbersValidator(testString);
            }).toThrow();
        }),
        it('Should return a string if non string passed in', ()=>{
            let testString = ['Bad structure'];
            expect(()=>{
                let _ = validators.stringSpacesNoNumbersValidator(testString);
            }).toThrow();
        })
    });
});