'use strict'

const models = require('../models/')

function getTransactionsForUser (userId) {
  return new Promise((resolve, reject) => {
    // in the future use findall
    models.Accounts.findOne({where: {UserId: userId}})
    .then((account) => {
      models.Transactions.findAll({where: {AccountId: account.id}})
      .then((value) => {
        resolve(value)
      })
      .catch((err) => {
        reject(err)
      })
    })
    .catch((err) => {
      reject(err)
    })
  })
}

module.exports = {
  getTransactionsForUser: getTransactionsForUser
}
