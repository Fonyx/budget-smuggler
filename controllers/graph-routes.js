const router = require('express').Router();
const { User, Transaction } = require('../models');
const {onlyIfLoggedIn} = require('../middleware/auth');
const clog = require('../utils/colorLogging');
const {createBalanceTimeline} = require('../utils/timelineBuilders');
const { getAllAccountIdsForUserId, sumAllUserAccountBalances } = require('../utils/instanceHelpers');

// get the test route for the timeline graph
router.get('/timeline', async(req, res) => {
    try{
        res.render('graphs');
    }catch(err){
        res.status(500).json({message:"Failed to return timeline"});
    }
});

/**
 * get the data packet for the timeline route 
 * list of {date: balance} objects
 * list of colors for each date, green if positive, red if negative
 */
router.get('/data/timeline', onlyIfLoggedIn, async(req, res)=> {
    try{
        let userObj = await User.findByPk(req.session.user_id);
        let userAccountIds = await getAllAccountIdsForUserId(req.session.user_id);
        let user = userObj.get({plain: true});

        const rawDbTransactions = await Transaction.findAll({
            where: {
              account_id: userAccountIds
            },
            order:[['due_date', 'ASC']],
            include: {all:true, nested: true}
        });
        // get the total of all the user accounts since this is the 'all' timeline
        let totalBalance = await sumAllUserAccountBalances(user.id);

        // build a timeline with the cumulative balance of all accounts since all transactions will be in this timeline
        var timeline = await createBalanceTimeline(totalBalance, rawDbTransactions, 'all');

        const response = {
            status: 'success',
            body: {
                timeline
            },
          };

        res.json(response);
    }catch(err){
        clog(err, 'red');
        res.status(500).send('Error with server trying to built timeline package')
    }
});

/**
 * get the data packet for the timeline route filtering by category
 * list of {date: balance} objects
 * list of colors for each date, green if positive, red if negative
 */
router.get('/data/timeline/:category_name', onlyIfLoggedIn, async(req, res)=> {
    try{
        let transactionObjs = await Transaction.findAll({
            where:{
                user_id: req.session.user_id
            },
            order:[['due_date', 'ASC']],
            nested: true,
            all: true
        });

        let userObj = await User.findByPk(req.session.user_id);
        let user = userObj.get({plain: true});

        var timeline = await createBalanceTimeline(user.balance, transactionObjs, req.params.category_name);

        const response = {
            status: 'success',
            body: {
                timeline
            },
          };

        res.json(response);
    }catch(err){
        clog(err, 'red');
        res.status(500).send('Error with server trying to built timeline package')
    }
});

module.exports = router;