const router = require('express').Router();
const { User, Transaction, Account } = require('../models');
const {onlyIfLoggedIn} = require('../middleware/auth');
const clog = require('../utils/colorLogging');
const {createBalanceTimeline} = require('../utils/timelineBuilders');
const { getAllAccountIdsForUserId, sumAllUserAccountBalances } = require('../utils/instanceHelpers');
const { getAccountNameFromParams } = require('../utils/routeHelpers');

// get the test route for the timeline graph
// router.get('/timeline/:account_name', onlyIfLoggedIn, async(req, res) => {
//     try{
//         let currentAccountName = req.params.account_name;
//         let userAccountObjs = await Account.findAll({
//             where:{
//                 user_id: req.session.user_id
//             },
//             // attributes: ['name']
//         });
//         let accounts = userAccountObjs.map((userAccountObj) =>{
//             return userAccountObj.get({plain: true});
//         });

//         // let accounts = [];
//         // userAccounts.forEach((userAccount) =>{
//         //     accounts.push(userAccount.name)
//         // })

//         res.render('graphs', {accounts, currentAccountName});
//     }catch(err){
//         clog(err, 'red');
//         res.status(500).json({message:"Failed to return timeline"});
//     }
// });

/**
 * get the data packet for the timeline route filtering by category
 * list of {date: balance} objects
 * list of colors for each date, green if positive, red if negative
 */
router.get('/data/timeline/:account_name', onlyIfLoggedIn, async(req, res)=> {
    try{
        // get an integer for the account_name's id, or if it was 'all' 
        var accountName = '';
        var accountBalance = 0;
        let accountId = await getAccountNameFromParams(req.params.account_name);
        if(accountId < 0){
            res.status(404).json({message:"No account with that id and you didn't say all"});
            return
        // case for when user wants every account in a timeline
        } else if(accountId === 0){
            let userAccountIds = await getAllAccountIdsForUserId(req.session.user_id);
            accountName = 'all';
            // get the total balance of every account for the logged in user
            accountBalance = await sumAllUserAccountBalances(req.session.user_id);
            var rawDbTransactions = await Transaction.findAll({
                where: {
                  account_id: userAccountIds
                },
                order:[['due_date', 'ASC']],
                include: {all:true, nested: true}
            });

        // case for user wanting a specific account
        } else {
            let accountObj = await Account.findByPk(accountId);
            let account = accountObj.get({plain: true});
            accountName = account.name;
            accountBalance = account.balance;
            var rawDbTransactions = await Transaction.findAll({
                where: {
                  account_id: account.id
                },
                include: {
                    all:true,
                    nested: true
                }
            });
        }


        // build a timeline with this accounts name and balance
        var timeline = await createBalanceTimeline(accountBalance, rawDbTransactions, accountName);

        const response = {
            status: 'success',
            body: {
                accountName, timeline
            },
          };

        res.json(response);
    }catch(err){
        clog(err, 'red');
        res.status(500).send(`Error with server trying to build timeline package for account with id:${req.params.account_id}`)
    }
});

module.exports = router;