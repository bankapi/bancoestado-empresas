'use strict'

const co = require('co')
const processFilesType = require('./processFilesType')
const saveTransactionsToDb = require('./saveTransactionsToDb')
const lodash = require('lodash')

// save transactions by type: outgoing or incoming
let processTransactionsFile = function* (type) {
  let result = yield processFilesType(type)
  return result
}

let saveTransactions = function* (transactions, UserId) {
  return yield saveTransactionsToDb(transactions, UserId)
}

// run generators
function processAndSaveTransactionsType (type, UserId) {
  return new Promise(function (resolve, reject) {
    // validate
    if (!(type === 'outgoing' || type === 'incoming')) {
      reject(new Error('invalidFileType'))
    }

    co(processTransactionsFile(type))
    .then((value) => {
      if (lodash.isEmpty(value)) {
        resolve(value)
      }
      co(saveTransactions(value, UserId))
      .then((value) => {
        resolve(value)
      }, (e) => {
        reject(e)
      })
    }, (e) => {
      reject(e)
    })
  })
}

module.exports = processAndSaveTransactionsType
