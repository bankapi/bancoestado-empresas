'use strict'

const lodash = require('lodash')
const fs = require('fs')
const path = require('path')
const processBancoEstadoFile = require('./processBancoEstadoFile')

let processFilesType = function (type) {
  return new Promise(function (resolve, reject) {
    if (!(type === 'outgoing/' || type === 'incoming/')) {
      reject(new Error('invalidFileType'))
    }

    fs.readdir(path.resolve('./downloads/' + type), function (err, files) {
      if (err) {
        reject(err)
      } else {
        console.log('files', files)
        if (lodash.isEmpty(files)) {
          resolve([])
        } else {
          lodash.forEach(files, (file) => {
            processBancoEstadoFile(type + file)
            .then((txs) => {
              resolve(txs)
            }, (e) => {
              reject(e)
            })
          })
        }
      }
    })
  })
}

module.exports = processFilesType
