const User = require('./User');
const Category = require('./Category');
const Transaction = require('./Transaction');

User.hasMany(Transaction, {
    foreignKey: 'user_id',
});

Transaction.belongsTo(User, {
    foreignKey: 'user_id',
});

Transaction.belongsTo(Category, {
    foreignKey: 'category_id',
});

Category.hasMany(Transaction, {
    foreignKey: 'category_id',
});

module.exports = { User, Category, Transaction };
