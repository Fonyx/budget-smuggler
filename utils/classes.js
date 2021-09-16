const dayjs = require('dayjs');
const clog = require('../utils/colorLogging');
const date_format = 'D/MM/YYYY';
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const frequencyMap = {
    daily: 1,
    weekly: 6,
    fortnightly: 13,
    // this is an approximation
    monthly: 30,
    annually: 355
}


function getDayMonthMap(year){
    let monthDays;
    // case for a leap year
    if(year % 4 === 0){
        monthDays = {
            'january':[1, 31],
            'february':[32, 60],
            'march':[61, 91],
            'april':[92,121],
            'may':[122, 152],
            'june':[153, 182],
            'july':[183, 213],
            'august':[214, 244],
            'september':[245, 274],
            'october':[275, 305],
            'november':[306, 335],
            'december':[336, 366],
        }
    // case for non leap years
    }else{
        monthDays = {
            'january':[1, 31],
            'february':[32, 59],
            'march':[60, 90],
            'april':[91, 120],
            'may':[121, 151],
            'june':[152, 181],
            'july':[182, 212],
            'august':[213, 243],
            'september':[244, 273],
            'october':[274, 304],
            'november':[305, 334],
            'december':[335, 365],
        }
    }
    return monthDays;
}

/**
 *  function that returns the day of year number for a date object from 0BC, defaults to today if no date parsed
 * @returns {int} a single integer from 0-largeNumber since lots of days since 0BC, + 1 every 4 years for leap year
 * */
function getDayNumberSince0BC(dateObj){
    // if parsed a date, use that date

    // get the day number of the date
    let dayNumber = parseInt(dateObj.format('d'));
    // get the week number of the date
    let weekNumber = dateObj.week();
    // get the year number of the date
    let yearNumber = dateObj.format('YYYY');

    // calculate number of days in years already completed
    let days = Math.round(yearNumber * 365.25)

    // add days for leap years, 1 day every 4 years, calculate x and round to floor
    // let leapYearDays = Math.floor((yearNumber)/4)
    // days += leapYearDays;

    // calculate number of days in weeks already completed (weeks -1)
    days += (weekNumber-1) * 7

    // add the number of days in current week
    days += dayNumber

    return days
}

/**
     * Converts a day count from 0BC back to a dayjs date obj ie-1000000345 -> dayjs('13/23/2003')
     * @param {int} relDateNum 
     * @return {dayjs()} dayjs object instance
     */
 function convertRelDateToDateObj(relDateNum){
    var result;
    // get date elements back from relDateNum that is relative to 0BC
    // days in a year
    let daysInYear = 365;
    // get the number of years and floor the result to remove the days in the current year
    let year = Math.floor(relDateNum/daysInYear)
    // since we floored above result, determine how many days progressed in current year by finding remainder
    let yearProgressInDays = relDateNum - (365*year);
    // get month and remainder (day of month) and construct new dayjs object
    let progress = convertYearProgressDaysIntoMonth(yearProgressInDays, year);

    result = new dayjs(progress.dayNum+'/'+progress.monthName+'/'+year);

    return result; 
}

/**
 * Converts a year progress day number into a month and a remainder
 * @param {} yearProgressDay 
 */
function convertYearProgressDaysIntoMonth(yearProgressDay, year){
    
    // {monthName:'', dayNum:int}
    var result = {
        monthName:'',
        dayNum:0
    }; 

    // get the mapping for the current year to turn day count into a monthName and remainder
    let dayMap = getDayMonthMap(year);
    /* 
    {
        january: [startInt, endInt],
        ...
    }
    */
    // determine which entry has the corresponding day number
    for(var [monthName, rangeList] of Object.entries(dayMap)){
        // if the yearProgressDay is in the range for this month, save that month, and subtract the month start from the yearProgressDayNum
        let monthStartNum = rangeList[0];
        let monthEndNum = rangeList[1];
        if(monthStartNum <= yearProgressDay && monthEndNum >= yearProgressDay){
            result.monthName = monthName;
            // remove the month start number from the progress number to get the day number inside the month
            result.dayNum = yearProgressDay-monthStartNum;
        }
    }

    return result;
}

/**
 * A dictionary object that acts like a python dictionary, with teh asterix that the value is a list
 * has getter, setter and print methods
 */
 class timelineDict{
    /**
     * 
     * @param {list} keys list of strings
     * @param {list} values list of elements [str, int]
     */
    constructor(keys, values){
        if(keys && values){
            this.keys = keys;
            this.values = values;
        } else {
            this.reset();
        }
    }

    reset(){
        this.keys = [];
        this.values = [];
    }

    print(){
        for(let i =0; i < this.keys.length; i++){
            let curr_key = this.keys[i];
            let curr_val = this.get(curr_key);
            // clog(`${curr_key}: ${curr_val}`, 'magenta');
        }
    }

    /**
     * sort internal keys and values
     * only sorts key date string in ascending order
     * 
     * {
     *      keys: ['1/2/2021', '1/12/2020', '1/8/2019'],
     *      values: [300, 500, 900]
     * }
     * ->
     * {
     *      keys: ['1/8/2019', '1/12/2020', '1/2/2021'],
     *      values: [900, 500, 300]
     * }
     * @returns {} Nothing
     *  */ 
    sort(){
        // since we are receiving two lists that are implicitly paired by order we need to combine them, then sort them, then separate them again, IKR what bad design but hey, if it works, it works
        var combined = this.keys.map((key)=>{
            var value = this.get(key);
            return {'key': key, 'value':value}
        });

        // now we need to sort the combined list of objects with a custom sort method
        var sortedCombined = combined.sort((firstEl, secondEl) => {

            var first = firstEl.key;
            var second = secondEl.key;

            var firstDate = dayjs(first, date_format);
            var secondDate = dayjs(second, date_format);

            let dayDifference = firstDate.diff(secondDate, 'd');
            // if day difference is positive, first date is after second date
            if (dayDifference > 0) {
                return 1;
            } else if (dayDifference < 0) {
                return -1;
            } else {
                // firstDate must be equal to secondDate
                return 0;
            }
        });

        // now we reset the key and value lists in this
        this.reset();

        // now we split them back out and attach them to the reset key and value lists
        for(let i=0; i<sortedCombined.length; i++){
            let current = sortedCombined[i];
            this.keys.push(current.key);
            this.values.push(current.value);
        }

    }

    // exports the contents of the dictionary to a list of objects with lists
    // i.e [{key: [value]}, {key: [value]}, {key: [value]}]
    export(){
        let data = []
        for(let i = 0; i < this.keys.length; i++){
            let curr_key = this.keys[i];
            // we need 0th element because values is a list with one element
            let curr_val = Math.round(this.get(curr_key));
            data.push({date: curr_key, amount: curr_val});
        }
        return data;
    }

    length(){
        return this.keys.length;
    }

    get_as_list(){
        let result = [];
        for(let i =0; i < this.keys.length; i++){
            result[this.keys[i]] = this.values[i];
        }
        return result;
    }   

    get(key){
        try{
            let keyIndex = this.keys.indexOf(key);
            let values = this.values[keyIndex];
            return this.values[keyIndex];
        } catch(error){
            console.error(error);
        }
    }
    /**Receives a key and value pair, only adds new pairs to dict
     * 
     * @param {str} key 
     * @param {str/int} value 
     */
    set(key, value){
        try{
            // check if key is already in dict
            let keyIndex = this.keys.indexOf(key);
            // indexOf returns -1 if not found
            if(keyIndex === -1){
                this.keys.push(key);
                this.values.push(value)
            } else {
                this.values[keyIndex] = value;
            }
        } catch(error){
            clog(error, 'red');
        }
    }
    /**Receives a key and value pair, updates current key value pair if found, otherwise inserts new key value pair
     * 
     * @param {str} key 
     * @param {str/int} value 
     */
    upsert(key, value){
        try{
            // check if key is already in dict then update that key
            let keyIndex = this.keys.indexOf(key);
            // since the key value pairs are synced we don't need to check for value index
            // if the value is to be updated
            if(keyIndex !== -1){
                // push the new value onto the list
                let previousValuesList = this.values[keyIndex];
                // clog(`Updating values from ${previousValuesList} with ${value}`, 'magenta');
                previousValuesList.push(value);
            // if the value is to be inserted
            }else{
                this.keys.push(key);
                this.values.push([value]);
            }
        } catch(error){
            console.error(error);
        }
    }
    /** special function used to reduce the values in each value entry
    for example: 
        {
            keys: [1, 2, 3],
            values: [[1, 2, 3],[2, 3, -4],[4, 5.5, 6]]
        }
        ->
        {
            keys: [1, 2, 3],
            values: [[6],[1],[15.5]]
        }
    */
    reduceValuesLists(){
        for(let i = 0; i < this.keys.length; i++){
            let currentKey = this.keys[i];
            // get value list for current key
            let currentValues = this.values[i];

            // accumulate list values with addition operation
            let reducedValues = currentValues.reduce((previous, current)=>{
                return previous + current;
            });
            // reset the valueList to the new value
            this.set(currentKey, reducedValues)
        }
    }
    /**
     * Function that accumulates daily transactions and offsets by users balance at day 0
     * {
     *      keys: [1, 2, 3],
     *      values: [[6], [6], [6]]
     * }
     * ->
     * {
     *      keys: [1, 2, 3],
     *      values: [[6], [12], [18]]
     * }
     * 
     */
    accumulate(){
        let accumulatedValue = 0;
        
        for(let i = 0; i < this.keys.length; i++){
            let currentKey = this.keys[i];
            let currentValue = this.values[i];
            let currentFloat = parseFloat(currentValue);
            accumulatedValue += currentFloat;
            this.set(currentKey, accumulatedValue);
        }
    }

    /**
     * Goes through date range of this.keys, and adds a new element at the 
     * frequency of the account compounding choice
     * @param {float} interestRate 
     * @param {str} compoundingFrequency 
     */
    compound(interestRate, compoundingFrequency){
        let multiplyRate = parseFloat(1 + interestRate/100);
        multiplyRate = multiplyRate/365; // for daily interest from an annual

        let endObj;
        // if there is more than one entry, take the last element as the end date obj
        let endDateString = '';
        if(this.keys.length >= 2){
            let dateString = this.keys.at(-1);
            let parts = dateString.split('/');
            endObj = new Date(parts[2], parts[1], parts[0]);

        // if there is no end date, get the date obj for end of december that year
        } else {
            endDateString = new Date(new Date().getFullYear(), 11, 31)
            endObj = new Date(endDateString);
        }
        // let startDateRelNumber = getDayNumberSince0BC(todayObj);
        // let endDateRelNumber = getDayNumberSince0BC(endObj);

        // get days to separate compounding calculations by
        let frequencydelta = frequencyMap[compoundingFrequency];


        for (var d =new Date(); d <= endObj; d.setDate(d.getDate() + frequencydelta)) {

            var dd = String(d.getDate()).padStart(2, '0');
            var mm = String(d.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = d.getFullYear();
            let today = dd + '/' + mm + '/' + yyyy;

            let currentBalance = this.values[0];
            let newBalance = currentBalance * multiplyRate;
            this.upsert(today, newBalance.toFixed(2));
        }

    }
}

module.exports ={
    timelineDict,
}