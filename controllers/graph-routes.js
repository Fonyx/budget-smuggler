const router = require('express').Router();
const { User, Transaction } = require('../models');
const {onlyIfLoggedIn} = require('../middleware/auth');
const clog = require('../utils/colorLogging');
const {createBalanceTimeline} = require('../utils/timelineBuilders');

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
        let labels = [];
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

        // let transactions = transactionObjs.map((transactionObj) => {
        //     return transactionObj.get({plain: true});
        // });

        var timeline = await createBalanceTimeline(user.balance, transactionObjs, 'all');

        transactionObjs.forEach((transactionObj) => {
            if(transactionObj.getDataValue('type') === 'expense'){
                colours.push('#ee110a');
            } else {
                colours.push('#0aee0a');
            }
            labels.push(transactionObj.getDateString());
            data.push(
                {   
                    date: transactionObj.getDateString(),
                    amount: transactionObj.getAmount()
                }
            )
        });

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
        let colours = [];
        let data = [];
        let labels = [];
        

        res.json(response);
    }catch(err){
        clog(err, 'red');
        res.status(500).send('Error with server trying to build timeline package by category')
    }
});

module.exports = router;