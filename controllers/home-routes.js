const { User } = require('../models');
const router = require('express').Router();
const { onlyIfLoggedIn } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    // Pass serialized data into Handlebars.js template
    res.render('homepage', {
      layout: 'main',
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

// router.get('/', async (req, res) => {
//   try {
//     // Get all users, sorted by name
//     const userData = await User.findAll({
//       attributes: { exclude: ['password'] },
//       order: [['username', 'ASC']],
//     });

//     // Serialize user data so templates can read it
//     const users = userData.map((project) => project.get({ plain: true }));

//     // Pass serialized data into Handlebars.js template
//     res.render('homepage', { users });
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

module.exports = router;