const User = require('./User');
const Account = require('./Account');
const Transaction = require('./Transaction');

User.hasMany(Account);

Account.belongsTo(User)


Account.hasMany(Transaction, {
    onDelete: 'CASCADE'
})

Transaction.belongsTo(Account, {
    onDelete: 'CASCADE'
});

module.exports = { User, Account, Transaction };
