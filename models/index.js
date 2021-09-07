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
    onDelete: 'CASCADE',
});

Category.hasMany(Transaction, {
    as:"transactions",
    onDelete: 'CASCADE',
});

module.exports = { User, Category, Transaction };
