'use strict'

const lodash = require('lodash')
const accountsModel = require('../models/').Accounts

function findOrUpdate (opts) {
  return new Promise((resolve, reject) => {
    if (!(opts.data && opts.id)) {
      return reject(new Error('data and UserId required'))
    }
    accountsModel.findById(opts.id)
    .then((account) => {
      if (account.data && lodash.isEqual(account.data, opts.data)) {
        resolve(account)
      } else if (!account.data) {
        accountsModel.update({data: opts.data}, {where: {id: opts.id}, returning: true})
        .then((account) => {
          resolve(account[1][0])
        })
        .catch((err) => {
          reject(err)
        })
      } else {
        return reject(new Error('accountData and provided data do not match: ' + JSON.stringify(account.data) + ' and ' + JSON.stringify(opts.data)))
      }
    })
    .catch((err) => {
      reject(err)
    })
  })
}

module.exports = {
  findOrUpdate: findOrUpdate
}
