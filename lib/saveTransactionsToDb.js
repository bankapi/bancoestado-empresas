'use strict'

const path = require('path')
const models = require(path.join(__dirname, '../data/models/'))
const accountsController = require(path.join(__dirname, '../data/controllers/')).accounts

function save (data, accountId) {
  return new Promise((resolve, reject) => {
    data.forEach((item) => {
      accountsController.findOrUpdate({data: item.accountData, id: accountId})
      .then((account) => {
        item.transactions.forEach((tx) => {
          let tr = {
            AccountId: account.id,
            data: tx
          }
          models.Transactions.findOrCreate({where: tr})
          .then((value) => {
            resolve(true)
          })
          .catch((err) => {
            reject(err)
          })
        })
      })
      .catch((err) => {
        reject(err)
      })
    })
  })
}

module.exports = save
