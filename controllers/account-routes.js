const router = require('express').Router();
const { Account } = require('../models');
const {onlyIfLoggedIn} = require('../middleware/auth');
const clog = require('../utils/colorLogging');

// Get all accounts
router.get('/', onlyIfLoggedIn, async (req, res) => {
    try{
        const rawDbAccounts = await Account.findAll();

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

// CREATE new account
router.post('/', onlyIfLoggedIn, async (req, res) => {
    try {
        const dbAccountData = await Account.create(req.body);
        res.status(200).json(dbAccountData);
    
    } catch (err) {
        if(err.name ==="SequelizeUniqueConstraintError"){
            clog(`Account ${req.body.name} already exists`, 'magenta');
            res.status(400).json({message:`Account ${req.body.name} already exists`})
        } else {
            clog(err, 'red');
            res.status(500).json(err);
        }
    }
});

// Get one account
router.get('/:account_name',onlyIfLoggedIn,  async (req, res) => {
    try{
        const dbAccount = await Account.findByPk(req.params.account_name, {
            include: {all:true, nested: true}
        });
        if(dbAccount){
            res.status(200).json(dbAccount);
        } else {
            res.status(404).json({message: `no Account with id: ${req.params.account_name} found`});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
});

// Update a account
router.put('/:account_name', onlyIfLoggedIn, async (req, res) => {
    try {
        const dbAccountData = await Account.findByPk(req.params.account_name);
        if(dbAccountData){
            dbAccountData.update({
                name: req.body.name,
                colour: req.body.colour,
                emoji: req.body.emoji
            });
            res.status(200).json(dbAccountData);
        } else {
            res.status(404).json({message: `No account ${req.params.account_name} exists`});
        }
    
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});

// Delete a account
router.delete('/:account_name', onlyIfLoggedIn, async (req, res) => {
    try{
        let target = await Account.findByPk(req.params.account_name);
        let targetName = target.name;
        if(target){
            target.destroy();
            res.status(200).json({message:`Deleted account ${targetName}`});
        } else{
            res.status(404).json({message: `Could not find account with id: ${req.params.account_name} to delete`});
        }
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})

module.exports = router;
