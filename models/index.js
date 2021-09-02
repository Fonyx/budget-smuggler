const User = require('./User');
const Category = require('./Category');
const Transaction = require('./Transaction');

User.hasMany(Transaction, {
    foreignKey: 'user_id',
    as: "transactions"
});

Transaction.belongsTo(User, {
    foreignKey: 'user_id',
    as:"owner",
});

Transaction.belongsTo(Category, {
    foreignKey: 'category_id',
    as: "category",
    onDelete: 'CASCADE',
});

Category.hasMany(Transaction, {
    foreignKey: 'category_id',
    as:"transactions",
    onDelete: 'CASCADE',
});

module.exports = { User, Category, Transaction };
