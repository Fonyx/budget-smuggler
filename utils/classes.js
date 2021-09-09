const clog = require('../utils/colorLogging');
/**
 * A dictionary object that acts like a python dictionary, with teh asterix that the value is a list
 * has getter, setter and print methods
 */
 class Dict{
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
            this.keys = [];
            this.values = [];
        }
    }

    print(){
        for(let i =0; i < this.keys.length; i++){
            let curr_key = this.keys[i];
            let curr_val = this.get(curr_key);
            clog(`${curr_key}: ${curr_val}`, 'magenta');
        }
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
                this.values.push([value])
            } else {
                this.values[keyIndex] = [value];
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
                clog(`Updating values from ${previousValuesList} with ${value}`, 'magenta');
                previousValuesList.push(value);
                clog(`Successfully updated to ${previousValuesList}`, 'magenta');
            // if the value is to be inserted
            }else{
                this.keys.push(key);
                this.values.push([value]);
                clog(`Successfully inserted new value`, 'magenta');
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
     * Function that adds all values previously seen, for example
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
            let currentValue = this.values[i][0];

            // dodge 0 index
            if(i > 0){
                accumulatedValue += currentValue
            } else {
                accumulatedValue = currentValue 
            }
            this.set(currentKey, accumulatedValue);
        }
    }
}

module.exports ={
    Dict,
}