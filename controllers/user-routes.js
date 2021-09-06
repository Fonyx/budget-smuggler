const router = require('express').Router();
const { Transaction, User } = require('../models');
const { onlyIfLoggedIn } = require('../middleware/auth');
const clog = require('../utils/colorLogging');

// get login empty page, renders login template
router.get('/login', (req, res) => {
  try {
    if (req.session.logged_in) {
      res.redirect('/profile');
      return;
    } else {
      res.render('login');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const dbUserData = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (!dbUserData) {
      res.status(400).json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }

    const validPassword = await dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect email or password. Please try again!' });
      return;
    }

    req.session.save(() => {
      req.session.logged_in = true;
      req.session.user_id = dbUserData.id;
      clog('Successfully logged in', 'green');
      res.status(200).json({ user: dbUserData, message: 'You are now logged in!' });
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get login empty page, renders login template
router.get('/signup', (req, res) => {
  try {
    if (req.session.logged_in) {
      res.redirect('/profile');
      return;
    } else {
      res.render('signup');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE new user
router.post('/signup', async (req, res) => {
  try {
    const dbUserData = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    req.session.save(() => {
      req.session.logged_in = true;
      req.session.user_id = dbUserData.id;
      clog('Successfully signed up', 'green');
      res.status(200).json(dbUserData);
    });
  } catch (err) {
    clog(err.message, 'red');
    res.status(500).json(err);
  }
});

// Use withAuth middleware to prevent access to route
router.get('/profile', async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const rawTransactions = await Transaction.findAll({
      include: { nested: true, all: true },
      where: { user_id: req.session.user_id }
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

// Logout post request - does the actual logging out
router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      clog('Successfully logged out', 'green');
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

// request for logout form to be rendered
router.get('/logout', (req, res) => {
  if (req.session.logged_in) {
    res.render('logout-confirm');
  } else {
    res.status(404).end();
  }
});

module.exports = router;
