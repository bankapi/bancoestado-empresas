'use strict'

const path = require('path')
const fs = require('fs')
const lodash = require('lodash')
const htmlTokenize = require('html-tokenize')
const through = require('through2')

let transactions = []
let accountData = {}
let include = false
let counter = 1
let tx = {}

function processBancoEstadoFile (fileName) {
  return new Promise(function (resolve, reject) {
    fs.createReadStream(path.resolve('./downloads/' + fileName))
    .pipe(htmlTokenize())
    .pipe(through.obj(function (row, enc, next) {
      row[1] = row[1].toString()
      if (include) {
        processData(row[1])
        include = false
      }
      if (row[0] === 'open' && row[1].includes('td class="c3"') && !row[1].includes('<!--')) {
        include = true
      }
      if (row[0] === 'close' && row[1] === '</html>') {
        // reset counter
        counter = 1
        // build response object
        let result = {
          fileName: fileName,
          accountData: accountData,
          transactions: transactions
        }
        // reset values
        accountData = {}
        transactions = []

        resolve(result)
      }
      next()
    }))
  })
}

function processData (data) {
  if (counter === 1) {
    accountData.bankName = 'BANCO_ESTADO'
    accountData.bankAccountHolderName = data
  }
  if (counter === 2) {
    accountData.bankAccountHolderId = data.replace(/\./g, '')
  }
  if (counter === 4) {
    accountData.bankAccountNumber = data.replace(/-/g, '')
  }
  if (counter && counter % 7 === 0) {
    if (data === '&nbsp;') {
      counter = 0
    } else {
      tx.date = data
    }
  }
  if (counter && counter % 8 === 0) {
    tx.bankId = data
  }
  if (counter && counter % 9 === 0) {
    tx.amount = lodash.toNumber(data.replace(/\./g, ''))
  }
  if (counter && counter % 10 === 0) {
    tx.bankName = data
  }
  if (counter && counter % 11 === 0) {
    data = data.split(' ')
    tx.bankAccountNumber = data.pop().replace(/-/g, '')
    tx.bankAccountType = data.toString().replace(/,/g, ' ').toUpperCase()
  }
  if (counter && counter % 12 === 0) {
    tx.bankAccountHolderId = data.replace(/\./g, '')
  }
  if (counter && counter % 13 === 0) {
    tx.state = data
    // we need to copy the object otherwise the reference is maintained
    transactions.push(lodash.clone(tx))
  }
  if (counter && counter % 14 === 0) {
    counter = 7
  }
  ++counter
}

module.exports = processBancoEstadoFile
