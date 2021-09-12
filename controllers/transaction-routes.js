const router = require('express').Router();
const { User, Account, Transaction } = require('../models');
const {onlyIfLoggedIn} = require('../middleware/auth');
const {getAllAccountIdsForUserId} = require('../utils/instanceHelpers');

// Get one transaction
router.get('/:transaction_id', onlyIfLoggedIn, async (req, res) => {
  try{
      const transaction = await Transaction.findByPk(req.params.transaction_id, {
          include: {all:true, nested: true}
      });
      if(transaction){
          res.status(200).json(transaction);
      } else {
          res.status(404).json({message: `no Transaction with id: ${req.params.transaction_id} found`});
      }
  }
  catch(err){
      console.log(err);
      res.status(500).json(err);
  }
});

// Get the delete transaction confirmation form with the transaction details being returned
router.get('/delete/:transaction_id', onlyIfLoggedIn, async (req, res) => {
    try{
        let transactionObj = await Transaction.findByPk(req.params.transaction_id);
        if(transactionObj){
            let transaction = transactionObj.get({plain: true})
            res.render('confirm-transaction-delete', {transaction});
        } else {
            res.status(404).json({message:"Could not find transaction to delete"})
        }
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

// Delete a transaction
router.delete('/delete/:transaction_id', onlyIfLoggedIn, async (req, res) => {
    try{
        let target = await Transaction.findByPk(req.params.transaction_id);
        let targetName = target.name;
        if(target){
            target.destroy();
            res.status(200).json({message:`Deleted transaction ${targetName}`});
        } else{
            res.status(404).json({message: `Could not find transaction with id: ${req.params.transaction_id} to delete`});
        }
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

// Get new transaction form
router.get('/', onlyIfLoggedIn, async (req, res) => {
    try {
        let userObj = await User.findByPk(req.session.user_id);
        let accountIds = await getAllAccountIdsForUserId(req.session.user_id);
        let accountObjs = await Account.findAll({
            where: {
                user_id: accountIds
            },
            nested: true,
            all: true,
        });
        let accounts = accountObjs.map((accountObj) => {
            return accountObj.get({plain: true});
        });

        if(userObj){
            let user = userObj.get();
            res.render('create-transaction', {user, accounts});
        } else {
            res.status(400).json({message:"Session user object didn't return an obj, likely user is signed out"});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// CREATE new transaction using form contents
router.post('/', onlyIfLoggedIn, async (req, res) => {
    try {
        const dbTransactionData = await Transaction.create(req.body);
        res.status(200).json(dbTransactionData);

    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// get the update transaction form
router.get('/update/:transaction_id', onlyIfLoggedIn, async (req, res) => {
    try{
        const rawTransaction = await Transaction.findByPk(req.params.transaction_id, {
            include: {all:true, nested: true}
        });
  
        let transaction = rawTransaction.get({plain: true});

        if(transaction){
            res.render('update-transaction', {transaction})
        } else {
            res.status(404).json({message: "no transaction found"});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

// put the update transaction form details
router.put('/update/:transaction_id', onlyIfLoggedIn, async (req, res) => {
    try{
        const rawTransaction = await Transaction.findByPk(req.params.transaction_id, {
            include: {all:true, nested: true}
        });
  
        let transaction = await rawTransaction.update(req.body);

        if(transaction){
            res.status(200).json({message:"Successfully updated transaction"});
        } else {
            res.status(404).json({message: "no transaction found for update"});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})


module.exports = router;
