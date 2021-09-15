const router = require('express').Router();
const { User, Transaction, Account } = require('../models');
const {onlyIfLoggedIn} = require('../middleware/auth');
const { getAllAccountIdsForUserId, sumAllUserAccountBalances } = require('../utils/instanceHelpers');
const sequelize = require('../config/connection');
const { Op } = require("sequelize");

// Get all transactions for a user
router.get('/', onlyIfLoggedIn, async (req, res) => {
    try{
        let userObj = await User.findByPk(req.session.user_id);
        let userAccountIds = await getAllAccountIdsForUserId(req.session.user_id);
        let user = userObj.get();
        let netBalance = await sumAllUserAccountBalances(user.id);

        const accountObjs = await Account.findAll({
            where:{
                user_id: req.session.user_id
            },
            all: true,
            nested: true
        });

        const accounts = accountObjs.map((accountObj) => {
            return accountObj.get({plain:true});
        });

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
            res.render('profile', {transactions, user, netBalance, accounts});
        } else {
            res.status(404).json({message: "no Transactions found"});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

// Get all transactions for a user for a account
router.get('/account/:account_id', onlyIfLoggedIn, async (req, res) => {
    try{
        let userObj = await User.findByPk(req.session.user_id);
        let user = userObj.get();
        let accountObj = await Account.findByPk(req.params.account_id);
        let account = await accountObj.get();

        // find all the accounts for the session user_id, but not the account currently shown
        const accountObjs = await Account.findAll({
            where:{
                [Op.and]: [
                    {user_id: req.session.user_id},
                    {id: {
                        [Op.not]: account.id
                        }
                    }
                ]
            },
            all: true,
            nested: true
        });

        const accounts = accountObjs.map((accountObj) => {
            return accountObj.get({plain:true});
        });

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
            res.render('account-transactions', {transactions, account, user, accounts});
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