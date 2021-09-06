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

module.exports = router;