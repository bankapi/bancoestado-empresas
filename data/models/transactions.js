'use strict'

module.exports = function (sequelize, DataTypes) {
  var Transactions = sequelize.define('Transactions', {
    data: DataTypes.JSONB,
    unique: true
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
        Transactions.belongsTo(models.Accounts, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false
          }
        })
      }
    }
  })
  return Transactions
}
