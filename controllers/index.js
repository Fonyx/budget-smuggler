const router = require('express').Router();
const homeRoutes = require('./home-routes');
const userRoutes = require('./user-routes');
const profileRoutes = require('./profile-routes');
const accountRoutes = require('./account-routes');
const transactionRoutes = require('./transaction-routes');
const graphRoutes = require('./graph-routes');

router.use('/', homeRoutes);
router.use('/user', userRoutes);
router.use('/profile', profileRoutes)
router.use('/transaction', transactionRoutes);
router.use('/account', accountRoutes);
router.use('/graph', graphRoutes);

module.exports = router;
