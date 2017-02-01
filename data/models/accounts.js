'use strict'

module.exports = function (sequelize, DataTypes) {
  var Accounts = sequelize.define('Accounts', {
    data: DataTypes.JSONB
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  })
  return Accounts
}
