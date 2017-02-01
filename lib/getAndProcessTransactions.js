'use strict'

const getTransactions = require('./crawlBancoEstadoGetTransactions')
const saveTransactionsType = require('./processAndSaveTransactionsType')
const deleteFilesType = require('./deleteFilesType')

function getAndProcessTransactions (opts) {
  return new Promise((resolve, reject) => {
    if (!(opts.accountId && opts.rutCompany && opts.rutUser && opts.password)) {
      return reject(new Error('required:UserId:rutCompany:rutUser:password'))
    }
    getTransactions(opts)
    .then((res) => {
      // process incoming transactions
      saveTransactionsType('incoming', opts.accountId)
      .then((value) => {
        console.log('saveTransactionsType:incoming:done')
        deleteFilesType('incoming')
        .then((value) => {
          saveTransactionsType('outgoing', opts.accountId)
          .then((value) => {
            console.log('saveTransactionsType:outgoing:done')
            deleteFilesType('outgoing')
            .then((value) => {
              console.log('done')
              resolve(true)
            })
            .catch((err) => {
              console.log('deleteFilesType:outgoing:err', err)
              reject(err)
            })
          })
          .catch((err) => {
            console.log('saveTransactionsType:outgoing:err', err)
            reject(err)
          })
        })
        .catch((err) => {
          console.log('deleteFilesType:incoming:err', err)
          reject(err)
        })
      })
      .catch((err) => {
        console.log('saveTransactionsType:incoming:err', err)
        reject(err)
      })
    })
    .catch((err) => {
      console.log('getTransactions:err', err)
      reject(err)
    })
  })
}

module.exports = getAndProcessTransactions
