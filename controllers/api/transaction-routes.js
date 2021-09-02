const router = require('express').Router();
const { User, Category, Transaction } = require('../../models');
const {onlyIfLoggedIn} = require('../../middleware/auth');

// Get all transactions for a user
router.get('/user/:id', async (req, res) => {
  try{
      const rawDbTransactions = await Transaction.findAll({
          where: {
            user_id: req.params.id
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

// Get one transaction
router.get('/:id', async (req, res) => {
  try{
      const dbTransaction = await Transaction.findByPk(req.params.id, {
          include: {all:true, nested: true}
      });
      if(dbTransaction){
          res.status(200).json(dbTransaction);
      } else {
          res.status(404).json({message: `no Transaction with id: ${req.params.id} found`});
      }
  }
  catch(err){
      console.log(err);
      res.status(500).json(err);
  }
})

// CREATE new transaction
router.post('/', async (req, res) => {
    let userObj = await User.findByPk(req.body.user_id);
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

// Update a transaction
router.put('/:id', async (req, res) => {
  try {
      const dbTransactionData = await Transaction.findByPk(req.params.id);
      if(dbTransactionData){
          dbTransactionData.update(req.body);
          res.status(200).json(dbTransactionData);
      } else {
          res.status(404).json({message: `No transaction with id: ${req.params.id}`});
      }
  
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Delete a transaction
router.delete('/:id', async (req, res) => {
  try{
      let target = await Transaction.findByPk(req.params.id);
      if(target){
          target.destroy();
          res.status(200).json({message:"Deleted transaction"});
      } else{
          res.status(404).json({message: `Could not find transaction with id: ${req.params.id} to delete`});
      }
  }catch(err){
      console.log(err);
      res.status(500).json(err);
  }
})


module.exports = router;
