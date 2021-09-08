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

// get the data packet for the timeline route 
router.get('/data/timeline', onlyIfLoggedIn, async(req, res)=> {
    try{
        let transactionObjs = await Transaction.findAll({
            nested: true,
            all: true
        });
        let transactions = transactionObjs.map((transactionObj) => {
            return transactionObj.get({plain: true});
        });
        res.status(200).json(transactions, colours, );
    }catch(err){

    }
})
module.exports = router;