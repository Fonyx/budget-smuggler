const router = require('express').Router();
const { User, Category, Transaction } = require('../models');
const {onlyIfLoggedIn} = require('../middleware/auth');

// Get one transaction
router.get('/:transaction_id', onlyIfLoggedIn, async (req, res) => {
  try{
      const dbTransaction = await Transaction.findByPk(req.params.transaction_id, {
          include: {all:true, nested: true}
      });
      if(dbTransaction){
          res.status(200).json(dbTransaction);
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
        let transactionObj = Transaction.findByPk(req.params.transaction_id);
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
router.delete('/:transaction_id', onlyIfLoggedIn, async (req, res) => {
    try{
        let target = await Transaction.findByPk(req.params.transaction_id);
        if(target){
            target.destroy();
            res.status(200).json({message:"Deleted transaction"});
        } else{
            res.status(404).json({message: `Could not find transaction with id: ${req.params.transaction_id} to delete`});
        }
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

// Get new transaction form
router.get('/create', onlyIfLoggedIn, async (req, res) => {
    try {
        res.render('create-transaction');
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

// CREATE new transaction using form contents
router.post('/create', onlyIfLoggedIn, async (req, res) => {
    let userObj = await User.findByPk(req.session.user_id);
    let categoryObj = await Category.findByPk(req.body.category_id);
    if(userObj && categoryObj){
        try {
            const dbTransactionData = await Transaction.create(req.body);
            res.status(200).json(dbTransactionData);
    
        } catch (err) {
        console.log(err);
        res.status(500).json(err);
        }
    } else {
        res.status(404).json({message:"Failed to find either category or user with those id's"});
    }
});

// Get all transactions for a user
router.get('/user', onlyIfLoggedIn, async (req, res) => {
    try{
        const rawDbTransactions = await Transaction.findAll({
            where: {
              user_id: req.session.user_id
            },
            include: {all:true, nested: true}
        });
  
        dbTransactions = rawDbTransactions.map((transactionObj) => {
            return transactionObj.get({plain: true});
        })
        if(dbTransactions){
            res.status(200).json(dbTransactions);
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
router.get('/user', onlyIfLoggedIn, async (req, res) => {
    try{
        const rawDbTransactions = await Transaction.findAll({
            where: {
              user_id: req.session.user_id
            },
            include: {all:true, nested: true}
        });
  
        dbTransactions = rawDbTransactions.map((transactionObj) => {
            return transactionObj.get({plain: true});
        })
        if(dbTransactions){
            res.status(200).json(dbTransactions);
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
router.get('/user/:category_id', onlyIfLoggedIn, async (req, res) => {
    try{
        const rawDbTransactions = await Transaction.findAll({
            where: {
              user_id: req.session.user_id,
              category_id: req.params.category_id
            },
            include: {all:true, nested: true}
        });
  
        dbTransactions = rawDbTransactions.map((transactionObj) => {
            return transactionObj.get({plain: true});
        })
        if(dbTransactions){
            res.status(200).json(dbTransactions);
        } else {
            res.status(404).json({message: "no Transactions found"});
        }
    }
    catch(err){
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
  
        let dbTransaction = rawTransaction.get({plain: true});

        if(dbTransaction){
            res.status(200).json(dbTransaction);
        } else {
            res.status(404).json({message: "no transaction found"});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});


// post the update transaction form details
router.post('/update/:transaction_id', onlyIfLoggedIn, async (req, res) => {
    try{
        const rawTransaction = await Transaction.findByPk(req.params.transaction_id, {
            include: {all:true, nested: true}
        });
  
        let dbTransaction = await rawTransaction.update(req.body);

        if(dbTransaction){
            res.status(200).json(dbTransaction);
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
