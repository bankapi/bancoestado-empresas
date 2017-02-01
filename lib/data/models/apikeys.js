'use strict'

module.exports = function (sequelize, DataTypes) {
  var ApiKeys = sequelize.define('ApiKeys', {
    apiKeys: DataTypes.JSONB,
    apiSalt: DataTypes.STRING,
    scopes: DataTypes.JSONB
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
        ApiKeys.belongsTo(models.Users, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false
          }
        })
      }
    }
  })
  return ApiKeys
}
