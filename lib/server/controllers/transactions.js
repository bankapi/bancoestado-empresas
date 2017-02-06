'use strict'

const transactionsController = require('../../data/controllers').transactions
const lodash = require('lodash')

function* getTransactionsForUser (next) {
  if (this.method !== 'GET') {
    return yield next
  }

  let result = yield transactionsController.getTransactionsForUser(this.UserId)
  .then((value) => {
    return value
  })
  .catch((err) => {
    return err
  })

  if (lodash.isEmpty(result)) {
    this.throw(404, 'transaction not found')
  }

  this.body = result
}

module.exports = {
  getTransactionsForUser: getTransactionsForUser
}
