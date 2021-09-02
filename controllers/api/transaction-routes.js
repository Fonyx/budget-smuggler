const router = require('express').Router();
const { Transaction } = require('../../models');

// CREATE new transaction
router.post('/', async (req, res) => {
    try {
      const dbTransactionData = await Transaction.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });
  
      req.session.save(() => {
        req.session.loggedIn = true;
  
        res.status(200).json(dbUserData);
      });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  });


module.exports = router;
