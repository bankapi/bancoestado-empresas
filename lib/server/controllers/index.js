'use strict'

const transactions = require('./transactions')

let bind = function (controller, property) {
  module.exports[property] = controller
}

bind(transactions, 'transactions')
