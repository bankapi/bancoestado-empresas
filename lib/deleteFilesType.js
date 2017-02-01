'use strict'

const lodash = require('lodash')
const fs = require('fs')
const path = require('path')

let deleteFilesType = function (type) {
  return new Promise(function (resolve, reject) {
    if (!(type === 'outgoing' || type === 'incoming')) {
      reject(new Error('invalidFileType'))
    }

    fs.readdir(path.resolve('./downloads/' + type + '/'), function (err, files) {
      if (err) {
        reject(err)
      } else {
        if (lodash.isEmpty(files)) {
          resolve([])
        } else {
          lodash.forEach(files, (file) => {
            fs.unlink(path.resolve('./downloads/' + type + '/' + file), function (err) {
              if (err) {
                reject(err)
              } else {
                resolve(true)
              }
            })
          })
        }
      }
    })
  })
}

module.exports = deleteFilesType
