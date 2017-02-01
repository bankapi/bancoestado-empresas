'use strict'
const isChileRut = require('../validators').isChileRut

module.exports = function (sequelize, DataTypes) {
  var Accounts = sequelize.define('Accounts', {
    data: DataTypes.JSONB,
    credentials: {
      type: DataTypes.JSONB,
      allowNull: false,
      validate: {
        validCredentials: function (value) {
          if (!(isChileRut(value.rutCompany) && isChileRut(value.rutUser) && value.password)) {
            throw new Error('credentials required:rutCompany,rutUser and password')
          }
        }
      }
    }
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
        Accounts.belongsTo(models.Users, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false
          }
        })
      }
    }
  })
  return Accounts
}
