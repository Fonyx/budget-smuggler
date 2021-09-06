const router = require('express').Router();
const { User } = require('../models');
const {onlyIfLoggedIn} = require('../middleware/auth');
const clog = require('../utils/colorLogging');



module.exports = router;