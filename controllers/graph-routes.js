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
        let labels = [];
        let transactionObjs = await Transaction.findAll({
            where:{
                user_id: req.session.user_id
            },
            order:[['due_date', 'ASC']],
            nested: true,
            all: true
        });
        // let transactions = transactionObjs.map((transactionObj) => {
        //     return transactionObj.get({plain: true});
        // });

        transactionObjs.forEach((transactionObj) => {
            if(transactionObj.getDataValue('type') === 'expense'){
                colours.push('red');
            } else {
                colours.push('green');
            }
            labels.push(transactionObj.getDateString());
            data.push(
                {   
                    date: transactionObj.getDateString(),
                    amount: transactionObj.getAmount()
                }
            )
        });

        let dataPacket = {
            data, colours, labels
        }

        const response = {
            status: 'success',
            body: dataPacket,
          };

        res.json(response);
    }catch(err){
        clog(err, 'red');
        res.status(500).send('Error with server trying to built timeline package')
    }
})
module.exports = router;