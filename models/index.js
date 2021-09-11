const User = require('./User');
const Account = require('./Account');
const Transaction = require('./Transaction');

User.hasMany(Account, {
    foreignKey: 'user_id',
    as: "accounts"
});

Account.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'owner'
})


Account.hasMany(Transaction, {
    foreignKey: 'account_id',
    as: 'account_transactions',
    onDelete: 'CASCADE'
})

Transaction.belongsTo(Account, {
    foreignKey: 'account_id',
    as:'transaction_account',
    onDelete: 'CASCADE'
});

module.exports = { User, Account, Transaction };
