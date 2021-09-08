const router = require('express').Router();
const { User, Transaction } = require('../models');
const {onlyIfLoggedIn} = require('../middleware/auth');
const clog = require('../utils/colorLogging');

// get the test route for the timeline graph
router.get('/timeline', async(req, res) => {
    try{
        let transactionObjs = await Transaction.findAll({
            nested: true,
            all: true
        })
        let transactions = transactionObjs.map((transactionObj) => {
            return transactionObj.get({plain: true});
        })
        res.render('graphs', {transactions});
    }catch(err){
        res.status(500).json({message:"Failed to return timeline"});
    }
});

module.exports = router;