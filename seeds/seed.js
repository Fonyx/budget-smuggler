const sequelize = require('../config/connection');

// import models
// const { User, Project } = require('../models');

// import seed data from .json files
// const userData = require('./userData.json');
// const projectData = require('./projectData.json');

// sync database
const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  // bulk create of model instances using json data
  // const users = await User.bulkCreate(userData, {
  //   individualHooks: true,
  //   returning: true,
  // });

  // for (const project of projectData) {
  //   await Project.create({
  //     ...project,
  //     user_id: users[Math.floor(Math.random() * users.length)].id,
  //   });
  // }

  process.exit(0);
};

seedDatabase();
