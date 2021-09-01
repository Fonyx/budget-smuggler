const colorNames = ['green','blue','magenta','red','white','black','yellow','cyan'];
const colorCodes = ["\x1b[32m","\x1b[34m","\x1b[35m","\x1b[31m","\x1b[37m","\x1b[30m","\x1b[33m","\x1b[36m"];
    
/**
 * Helper function to get a color code for a requested color name string, don't call this function directly, call clog instead. Hence the underscored name
 * @param {} colorChoice 
 * @returns 
 */
function __getColorCode(colorChoice){
    let colorPrefIndex = colorNames.indexOf(colorChoice);
    if(colorPrefIndex !== -1){
        let colorCode = colorCodes[colorPrefIndex];
        return colorCode;
    } else {
        throw new Error('Color not available');
    }
}

/**
 * A function that logs to console in a specific color, then resets log color to black
 * Available colors are 'green', 'blue', 'magenta', 'red', 'white', 'black', 'yellow', 'cyan'. 
 * Example would be clog('Bad alert for user', 'red')
 * @param {str} text 
 * @param {str} colorPref-optional defaults to black 
 */
 function clog(text, colorPref) {
    let colorCode = __getColorCode('black');
    // handle optional parse
    if (colorPref) {
      try{
        colorCode = __getColorCode(colorPref);
        console.log(`${colorCode}`);
        console.log(text);
        
      }catch(err){
        if(err.message === 'Color not available'){
          // if the user requests an invalid color, log that using red
          colorCode = __getColorCode('red');
          console.log(`${colorCode}`);
          console.log(text, `Color '${colorPref}' unavailable, choose from ${colorNames}`);
        }
      }
      // reset the console color to black
      let defaultCode = __getColorCode('blue');
        console.log(`${defaultCode}`);
    }
    
  }


module.exports = clog;