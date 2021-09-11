const {Account} = require('../models');
const clog = require('../utils/colorLogging');
/**
 * Returns either 0 if the user requested all accounts, or the id of the account name requested, returns negative if nothing is found
 * @param {str} requestParameter 
 * @returns {int} the id of the account the request wants from the name, 0->'all', -1-> None found with matching name to request parameter
 */
async function getAccountNameFromParams(requestParameter){
    let accountId = -1; // leave it negative in case nothing matches
    if(requestParameter.toLowerCase() === 'all'){
        accountId = 0
    } else {
        let accountObj = await Account.findOne({
            where:{
                name: requestParameter
            },
            all: true,
            nested: true
        });
        if(accountObj){
            let account = accountObj.get({plain: true});
            accountId = account.id;
        }else{
            clog(`No account with name: ${requestParameter}`, 'magenta');
        }
    }
    return accountId;
}

module.exports = {
    getAccountNameFromParams,
}