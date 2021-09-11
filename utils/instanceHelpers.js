const {Account} = require('../models');


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

module.exports = {
    getAllAccountIdsForUserId,
}