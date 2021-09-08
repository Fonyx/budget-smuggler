const router = require('express').Router();
const { User, Category, Transaction } = require('../models');
const {onlyIfLoggedIn} = require('../middleware/auth');

// Get all transactions for a user
router.get('/', onlyIfLoggedIn, async (req, res) => {
    try{
        let userObj = await User.findByPk(req.session.user_id);
        let user = userObj.get();

        const rawDbTransactions = await Transaction.findAll({
            where: {
              user_id: user.id
            },
            include: {all:true, nested: true}
        });
  
        transactions = rawDbTransactions.map((transactionObj) => {
            return transactionObj.get({plain: true});
        })
        if(transactions){
            res.render('profile', {transactions, user});
        } else {
            res.status(404).json({message: "no Transactions found"});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

// Get all transactions for a user for a category
router.get('/:category_name', onlyIfLoggedIn, async (req, res) => {
    try{
        let userObj = await User.findByPk(req.session.user_id);
        let user = userObj.get();

        const rawDbTransactions = await Transaction.findAll({
            where: {
              user_id: user.id,
              category_name: req.params.category_name
            },
            include: {all:true, nested: true}
        });
  
        transactions = rawDbTransactions.map((transactionObj) => {
            return transactionObj.get({plain: true});
        })
        if(transactions){
            res.render('profile', {transactions, user});
        } else {
            res.status(404).json({message: "no Transactions found"});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;