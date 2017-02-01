'use strict'

const path = require('path')
const models = require(path.join(__dirname, '../data/models/'))

function save (data) {
  return new Promise((resolve, reject) => {
    data.forEach((item) => {
      models.Accounts.findOrCreate({where: {data: item.accountData}})
      .spread((account) => {
        item.transactions.forEach((tx) => {
          let tr = {
            AccountId: account.id,
            data: tx
          }
          models.Transactions.create(tr)
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
