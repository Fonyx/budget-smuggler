const sequelize = require('../config/connection');

 //import models
 const { User, Account, Transaction } = require('../models');

// import seed data from .json files
const accountData = require('./accountData.json');
const userData = require('./userData.json');
const transactionData = require('./transactionData.json');

// sync database
const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  // bulk create of model instances using json data
  await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  await Account.bulkCreate(accountData, {
    individualHooks: true,
    returning: true,
  });

  await Transaction.bulkCreate(transactionData, {
    individualHooks: true,
    returning: true,
  });

  process.exit(0);
};

seedDatabase();
