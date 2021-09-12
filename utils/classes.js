const dayjs = require('dayjs');
const clog = require('../utils/colorLogging');
const date_format = 'D/MM/YYYY';
var customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
/**
 * A dictionary object that acts like a python dictionary, with teh asterix that the value is a list
 * has getter, setter and print methods
 */
 class dict{
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
    /* special function used to reduce the values in each value entry
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
    accumulate(starting_balance){
        let accumulatedValue = parseFloat(starting_balance);

        for(let i = 0; i < this.keys.length; i++){
            let currentKey = this.keys[i];
            let currentValue = this.values[i];

            // dodge 0 index as that is the current date with starting balance
            if(i > 0){
                let currentFloat = parseFloat(currentValue);
                accumulatedValue += currentFloat;
            }
            this.set(currentKey, accumulatedValue);
        }

        this.print();
    }
}

module.exports ={
    dict,
}