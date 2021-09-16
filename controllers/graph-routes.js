const router = require('express').Router();
const { User, Transaction, Account } = require('../models');
const {onlyIfLoggedIn} = require('../middleware/auth');
const clog = require('../utils/colorLogging');
const {createBalanceTimelineForAll, createBalanceTimelineForAccount} = require('../utils/timelineBuilders');
const { getAllAccountIdsForUserId, sumAllUserAccountBalances } = require('../utils/instanceHelpers');
const { getAccountNameFromParams } = require('../utils/routeHelpers');


/**
 * get the data packet for the timeline route filtering by category
 * list of {date: balance} objects
 * list of colors for each date, green if positive, red if negative
 */
router.get('/data/timeline/all', onlyIfLoggedIn, async(req, res)=> {
    try{
        // get an integer for the account_name's id, or if it was 'all' 
        let userAccountIds = await getAllAccountIdsForUserId(req.session.user_id);
        accountName = 'all';
        // get the total balance of every account for the logged in user
        starting_balance = await sumAllUserAccountBalances(req.session.user_id);
        var rawDbTransactions = await Transaction.findAll({
            where: {
                account_id: userAccountIds
            },
            order:[['due_date', 'ASC']],
            include: {all:true, nested: true}
        });

        // build a timeline with this accounts name and balance
        var timeline = await createBalanceTimelineForAll(starting_balance, rawDbTransactions, accountName);

        const response = {
            status: 'success',
            body: {
                accountName, timeline
            },
        };

        res.json(response);
    }catch(err){
        clog(err, 'red');
        res.status(500).send(`Error with server trying to build timeline package for all accounts`)
    }
});


/**
 * get the data packet for the timeline route filtering by category
 * list of {date: balance} objects
 * list of colors for each date, green if positive, red if negative
 */
 router.get('/data/timeline/account/:account_name_slug', onlyIfLoggedIn, async(req, res)=> {
    try{        
        let accountName = req.params.account_name_slug.replace(/-/g, ' ');
        let accountObj = await Account.findOne({
            where:{
                name: accountName
            }
        });
        let account = accountObj.get({plain: true});
        var rawDbTransactions = await Transaction.findAll({
            where: {
                account_id: account.id
            },
            include: {
                all:true,
                nested: true
            }
        });
        
        // build a timeline with this accounts name and balance
        var timeline = await createBalanceTimelineForAccount(account, rawDbTransactions);

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