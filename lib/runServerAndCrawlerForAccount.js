'use strict'

const pm2 = require('pm2')
const config = require('./pm2.config.js')

function runServerAndCrawlerForAccount (accountId) {
  // set accountId as process args
  config.apps[0].args = accountId.toString()
  return new Promise((resolve, reject) => {
    pm2.connect(function (err) {
      if (err) {
        reject(err)
        process.exit(2)
      }

      pm2.start(config, function (err, apps) {
        if (err) {
          reject(err)
        } else {
          // Disconnects from PM2
          pm2.disconnect()
          resolve({account: accountId, server: '1337'})
        }
      })
    })
  })
}

module.exports = runServerAndCrawlerForAccount
