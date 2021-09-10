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
        // since this is an onlyLoggedIn route, this is always true
        var logged_in = true;
        if(transactions){
            res.render('profile', {transactions, user, logged_in});
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
router.get('/category/:category_name', onlyIfLoggedIn, async (req, res) => {
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

//request for update form for user balance
router.get('/balance', onlyIfLoggedIn, async (req, res) => {
    try{
      let userObj = await User.findByPk(req.session.user_id);
      let user = userObj.get();
      res.render('update-balance', {user});
    }catch(err){
      clog('Failed to return update-balance form', 'red');
      res.status(500).json({message:"Failed to serve update-balance form"});
    }
});
  
// request to update user balance as a put request
router.put('/balance', onlyIfLoggedIn, async (req, res) => {
  try{
    let userObj = await User.findByPk(req.session.user_id, {
      all: true,
      nested:true
    })
    clog(`Updating user balance from, ${userObj.balance} to ${req.body.balance}`, 'blue')
    if(userObj){
      // this might not check well enough, use should use float for db structure but int should also work
      if(typeof(req.body.balance) === 'number'){
        userObj.update({
          balance:req.body.balance
        });
        res.status(200).json({message:`Successfully updated user balance to ${req.body.balance}`});
      } else {
        res.status(400).json({message:"User did not submit a number for balance"})
      }
    } else {
      res.status(404).json({message:"Could not find logged in user object"})
    }
  }catch(err){
    res.status(500).json({message:"Server failed to update user balance"});
  }
});

module.exports = router;