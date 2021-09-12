const {User, Account} = require('../models');
const sequelize = require('../config/connection');

async function getAllAccountIdsForUserId(id){
    let accountObjs = await Account.findAll({
        where:{
            user_id:id
        },
        attributes: ['id']
    });
    let accountIds = accountObjs.map((accountObj) => {
        let account = accountObj.get();
        return account.id;
    });
    // this returns a list or a single int
    return accountIds;
}

/**
 * Finds all accounts a user has, then sums all their balances
 * @param {str} user_id of user
 * @returns {int} sum of all account balances for a user
 */
async function sumAllUserAccountBalances(user_id){

    var total = 0;

    let testTotalObj = await Account.findAll({
        where:{
            user_id: user_id
        },
        attributes: ['user_id',[sequelize.fn('sum', sequelize.col('balance')), 'total']],
        raw:true,
    });

    if(testTotalObj.length > 0){
        total = testTotalObj[0].total.toFixed(2);
    }

    return total;

}

module.exports = {
    getAllAccountIdsForUserId,
    sumAllUserAccountBalances,
}