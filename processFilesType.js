'use strict'

const lodash = require('lodash')
const fs = require('fs')
const path = require('path')
const processBancoEstadoFile = require('./processBancoEstadoFile')
const async = require('async')

let processFilesType = function (type) {
  return new Promise(function (resolve, reject) {
    if (!(type === 'outgoing/' || type === 'incoming/')) {
      reject(new Error('invalidFileType'))
    }

    fs.readdir(path.resolve('./downloads/' + type), function (err, files) {
      if (err) {
        reject(err)
      } else {
        if (lodash.isEmpty(files)) {
          resolve([])
        } else {
          let result = []
          async.each(files, (file, cb) => {
            processBancoEstadoFile(type + file)
            .then((txs) => {
              result.push(txs)
              cb()
            }, (e) => {
              cb(e)
            })
          }, (err) => {
            if (err) {
              reject(err)
            } else {
              resolve(result)
            }
          })
        }
      }
    })
  })
}

module.exports = processFilesType
