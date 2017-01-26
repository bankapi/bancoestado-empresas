'use strict'

const path = require('path')
const fs = require('fs')
const trumpet = require('trumpet')
const tr = trumpet()
const through = require('through2')
const lodash = require('lodash')

let transactions = []
let accountData = {}
let counter = 0
let tx = {}

tr.selectAll('td .c3', function (el) {
  let stm = el.createReadStream()

  stm.pipe(through(function (data, _, next) {
    data = data.toString()
    if (counter === 1) {
      accountData.bank_account_holder_name = data
    }
    if (counter === 2) {
      accountData.bank_account_holder_id = data.replace(/\./g, '')
    }
    if (counter === 4) {
      accountData.bank_account_number = data.replace(/-/g, '')
    }
    if (counter && counter % 7 === 0) {
      tx.date = data
    }
    if (counter && counter % 8 === 0) {
      tx.bank_id = data
    }
    if (counter && counter % 9 === 0) {
      tx.amount = data.replace(/\./g, '')
    }
    if (counter && counter % 10 === 0) {
      tx.bank_name = data
    }
    if (counter && counter % 11 === 0) {
      data = data.split(' ')
      tx.bank_account_number = data.pop().replace(/-/g, '')
      tx.bank_account_type = data.toString().replace(/,/g, ' ')
    }
    if (counter && counter % 12 === 0) {
      tx.bank_account_holder_id = data.replace(/\./g, '')
    }
    if (counter && counter % 13 === 0) {
      tx.state = data
      // we need to copy the object otherwise the reference is maintained
      transactions.push(lodash.clone(tx))
      // console.log('accountData', accountData)
      // console.log('transactions', transactions)
    }
    if (counter && counter % 14 === 0) {
      counter = 7
    }
    ++counter
  }))
})

function processFile (fileName) {
  return new Promise(function (resolve, reject) {
    fs.createReadStream(path.resolve('./downloads/outgoing/' + fileName)).pipe(tr)
    // Here we listen to the end of file
    .on('end', () => {
      resolve({
        accountData: accountData,
        transactions: transactions
      })
    })
    .on('error', (e) => {
      reject(e)
    })
  })
}

module.exports = processFile
