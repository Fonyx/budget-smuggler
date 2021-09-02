const { User, Transaction, Category } = require('../models');
const router = require('express').Router();
const {onlyIfLoggedIn} = require('../middleware/auth');

// home route get request
router.get('/', async (req, res) => {
  try {
    // Pass serialized data into Handlebars.js template
    res.render('homepage', {
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// get login empty page, renders login template
router.get('/login', (req, res) => {
  try{
    if (req.session.logged_in){
      res.redirect('/profile');
      return;
    } else {
      res.render('login');
    }
  } catch(err){
    res.status(500).json(err);
  }
});

// get login empty page, renders login template
router.get('/signup', (req, res) => {
  try{
    if (req.session.logged_in){
      res.redirect('/profile');
      return;
    } else {
      res.render('signup');
    }
  } catch(err){
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const rawTransactions = await Transaction.findAll({
      include: {nested: true, all: true},
      where: {user_id: req.session.user_id}
    },
    {
      include: ['category'],
    });

    const transactions = rawTransactions.map((transObj) => {
      return transObj.get({ plain: true });
    });

    res.render('profile', {
      transactions,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;