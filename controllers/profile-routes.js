const router = require('express').Router();
const { User, Transaction, Account } = require('../models');
const {onlyIfLoggedIn} = require('../middleware/auth');
const { getAllAccountIdsForUserId, sumAllUserAccountBalances } = require('../utils/instanceHelpers');

// Get all transactions for a user
router.get('/', onlyIfLoggedIn, async (req, res) => {
    try{
        let userObj = await User.findByPk(req.session.user_id);
        let userAccountIds = await getAllAccountIdsForUserId(req.session.user_id);
        let user = userObj.get();
        let netBalance = await sumAllUserAccountBalances(user.id);

        const rawDbTransactions = await Transaction.findAll({
            where: {
              account_id: userAccountIds
            },
            order:[['due_date', 'ASC']],
            include: {all:true, nested: true}
        });
  
        let transactions = rawDbTransactions.map((transactionObj) => {
            return transactionObj.get({plain: true});
        })
        if(transactions){
            res.render('profile', {transactions, user, netBalance});
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
router.get('/account/:account_id', onlyIfLoggedIn, async (req, res) => {
    try{
        let userObj = await User.findByPk(req.session.user_id);
        let user = userObj.get();
        let accountObj = await Account.findByPk(req.params.account_id);
        let account = accountObj.get();

        const rawDbTransactions = await Transaction.findAll({
            where: {
              account_id: req.params.account_id
            },
            include: {all:true, nested: true}
        });
  
        let transactions = rawDbTransactions.map((transactionObj) => {
            return transactionObj.get({plain: true});
        })
        if(transactions){
            res.render('account-transactions', {transactions, account, user});
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