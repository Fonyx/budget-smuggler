const router = require('express').Router();
const { User, Transaction } = require('../models');
const {onlyIfLoggedIn} = require('../middleware/auth');
const clog = require('../utils/colorLogging');

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
        // let forecast = userObj.getForecast();
        // this is a test arrangement that only does transaction values, not their cumulative account balance. Write that in a user model method
        let colours = [];
        let data = [];
        let transactionObjs = await Transaction.findAll({
            where:{
                user_id: req.session.user_id
            },
            nested: true,
            all: true
        });
        let transactions = transactionObjs.map((transactionObj) => {
            return transactionObj.get({plain: true});
        });

        transactions.forEach((transaction) => {
            if(transaction.type === 'expense'){
                colours.push('red');
            } else {
                colours.push('green');
            }
            data.push(
                {date: transaction.getDueDateAsDateString(),
                balance: transaction.amount}
            )
        })

        res.status(200).json(data, colours);
    }catch(err){
        res.status(500).send('Error with server trying to built timeline package')
    }
})
module.exports = router;