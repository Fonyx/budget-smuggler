const {User, Account} = require('../models');


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
    return accountIds;
}

/**
 * Finds all accounts a user has, then sums all their balances
 * @param {str} user_id of user
 * @returns {int} sum of all account balances for a user
 */
async function sumAllUserAccountBalances(user_id){
    let accountObjs = await Account.findAll({
        where:{
            id: user_id
        },
        attributes: ['balance']
    });
    let balances = accountObjs.map((accountObj) => {
        return accountObj.get({
            attributes: 'balance'
        })
    });
    // this is like a summing list comprehension but the result is still an object that has a balance field....meh
    let total = balances.reduce((a, b) => {
        return {x: a.balance + b.balance};
    });
    return total.balance;
}

module.exports = {
    getAllAccountIdsForUserId,
    sumAllUserAccountBalances,
}