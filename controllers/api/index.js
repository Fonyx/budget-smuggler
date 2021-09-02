const router = require('express').Router();
const userRoutes = require('./user-routes');
const categoryRoutes = require('./category-routes');
const transactionRoutes = require('./transaction-routes');

router.use('/user', userRoutes);
router.use('/category', categoryRoutes);
router.use('/transaction', transactionRoutes);

module.exports = router;
