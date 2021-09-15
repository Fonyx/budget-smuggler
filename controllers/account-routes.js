const router = require('express').Router();
const { User, Account } = require('../models');
const {onlyIfLoggedIn} = require('../middleware/auth');
const clog = require('../utils/colorLogging');

// Get all accounts for a user
router.get('/', onlyIfLoggedIn, async (req, res) => {
    try{
        const rawDbAccounts = await Account.findAll({
            where:{
                user_id: req.session.user_id
            },
            order:[['name', 'ASC']],
            nested: true,
            all: true
        });

        dbAccounts = rawDbAccounts.map((accountObj) => {
            return accountObj.get({plain: true});
        })
        if(dbAccounts){
            res.status(200).json(dbAccounts);
        } else {
            res.status(404).json({message: "no Accounts found"});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

// get account create form
router.get('/create', onlyIfLoggedIn, async (req, res) => {
    try{
        let userObj = await User.findByPk(req.session.user_id);
        let user = userObj.get();
        res.render('create-update-account', {user})
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

// CREATE new account
router.post('/create', onlyIfLoggedIn, async (req, res) => {
    try {
        let user_id = req.session.user_id;
        const dbAccountData = await Account.create({
            ...req.body,
            user_id
        });
        res.status(200).json(dbAccountData);
    
    } catch (err) {
        if(err.name ==="SequelizeUniqueConstraintError"){
            clog(`Account ${req.body.name} already exists`, 'magenta');
            res.status(409).json({message:`Account ${req.body.name} already exists`})
        } else {
            clog(err, 'red');
            res.status(500).json(err);
        }
    }
});

//request for update form for user balance
router.get('/update/:account_id', onlyIfLoggedIn, async (req, res) => {
    try{
        let accountObj = await Account.findByPk(req.params.account_id, {
            all: true, 
            nested: true
        });
        let account = accountObj.get({plain:true});
        let userObj = await User.findByPk(req.session.user_id);
        let user = userObj.get();
        res.render('create-update-account', {user, account})
    }catch(err){
      clog(err, 'red');
      res.status(500).json({message:"Failed to serve update-balance form"});
    }
});
  
// request to update account as a put request
router.put('/update/:account_id', onlyIfLoggedIn, async (req, res) => {
  try{
    let accountObj = await Account.findByPk(req.params.account_id);
    
    if(accountObj){
        clog(`Updating account ${req.body.name} balance from, ${accountObj.balance} to ${req.body.balance}`, 'magenta')

        await accountObj.update(req.body);

        clog(`Successfully updated account ${req.body.name} balance to ${req.body.balance}`, 'blue');
        res.status(200).json({message:`Successfully updated account ${req.body.name}'s' balance to ${req.body.balance}`});
      } else {
        clog(`User submitted ${typeof(req.body.balance)} instead of number`, 'red');
        res.status(400).json({message:"User did not submit a number for balance"})
      }
  }catch(err){
    clog(err, 'red');
    res.status(500).json({message:"Server failed to update user balance"});
  }
});

// Delete a account
router.delete('/:account_id', onlyIfLoggedIn, async (req, res) => {
    try{
        let target = await Account.findByPk(req.params.account_id);
        let targetName = target.name;
        if(target){
            target.destroy();
            res.status(200).json({message:`Deleted account ${targetName}`});
        } else{
            res.status(404).json({message: `Could not find account with id: ${req.params.account_id} to delete`});
        }
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})





module.exports = router;
