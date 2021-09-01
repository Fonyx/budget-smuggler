const sequelize = require('../config/connection');

 //import models
 const { User, Category, Transaction } = require('../models');

// import seed data from .json files
const categoryData = require('./categoryData.json');
const userData = require('./userData.json');
//const transactionData = require('./transactionData.json');

// sync database
const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  // bulk create of model instances using json data
  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const categories = await Category.bulkCreate(categoryData, {
    individualHooks: true,
    returning: true,
  });

  //const transactions = await Category.bulkCreate(transactionData, {
    //individualHooks: true,
    //returning: true,
  //});

  //for (const project of transactionData) {
    //await Project.create({
      //...project,
      //user_id: users[Math.floor(Math.random() * users.length)].id,
    //});

  process.exit(0);
};

seedDatabase();
