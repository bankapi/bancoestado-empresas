'use strict'

const models = require('./data/models')
const getAndProcessTransactions = require('./getAndProcessTransactions')
const lodash = require('lodash')

function runCrawler () {
  let id = process.argv[2]
  models.Accounts.findById(id)
  .then((account) => {
    if (lodash.isEmpty(account)) {
      console.error('error:emptyAccount')
      process.exit(1)
    } else {
      let opts = {
        accountId: account.id,
        rutCompany: account.credentials.rutCompany,
        rutUser: account.credentials.rutUser,
        password: account.credentials.password
      }
      getAndProcessTransactions(opts)
      .then((value) => {
        // for some reason nightmare does not relaunch when using setInterval to call this function
        // the solution for now is to exit and leave pm2 to relaunch the process
        process.exit()
      })
      .catch((err) => {
        console.error(err)
        process.exit(1)
      })
    }
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

setTimeout(() => {
  runCrawler()
}, 60 * 1000)
