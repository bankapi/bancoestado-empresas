'use strict'

const inquirer = require('inquirer')
const validators = require('./lib/data/validators')
const controllers = require('./lib/data/controllers')
const models = require('./lib/data/models')
const getAndProcessTransactions = require('./lib/getAndProcessTransactions')
const runServerAndCrawl = require('./lib/runServerAndCrawlerForAccount')

// Start CLI prompter
welcome()

function welcome () {
  let question = [{
    type: 'list',
    name: 'welcome',
    message: 'What do you want to do?',
    choices: [
      'Create user',
      'Create api key for user',
      'Show user',
      'Show account',
      'Update account credentials',
      'Crawl and save transactions for account',
      'Run server for account',
      'Exit'
    ]
  }]
  inquirer.prompt(question)
  .then((answer) => {
    switch (answer.welcome) {
      case 'Create user':
        createUser()
        break
      case 'Create api key for user':
        createApiKeyForUser()
        break
      case 'Show user':
        showUser()
        break
      case 'Show account':
        showAccount()
        break
      case 'Update account credentials':
        updateAccountCredentials()
        break
      case 'Crawl and save transactions for account':
        crawlAndSaveTransactionsForAccount()
        break
      case 'Run server for account':
        runServerForAccount()
        break
      default:
        process.exit()
    }
  })
}

function createUser () {
  let question = [{
    type: 'input',
    name: 'email',
    message: 'Enter user email',
    validate: (value) => {
      if (validators.isEmail(value)) {
        return true
      }
      return 'Please enter a valid email'
    }
  }, {
    type: 'input',
    name: 'rutCompany',
    message: 'Enter company RUT',
    validate: (value) => {
      if (validators.isChileRut(value)) {
        return true
      }
      return 'Please enter a valid RUT: xxxxxx-x'
    }
  }, {
    type: 'input',
    name: 'rutUser',
    message: 'Enter user RUT',
    validate: (value) => {
      if (validators.isChileRut(value)) {
        return true
      }
      return 'Please enter a valid RUT: xxxxxx-x'
    }
  }, {
    type: 'password',
    name: 'password',
    message: 'Enter account password'
  }]
  inquirer.prompt(question)
  .then((answer) => {
    let opts = {
      email: answer.email,
      credentials: {
        rutCompany: answer.rutCompany,
        rutUser: answer.rutUser,
        password: answer.password
      }
    }
    controllers.users.create(opts)
    .then((user) => {
      console.log(`
***** CREATED USER *****
${JSON.stringify(user)}
***** STORE API KEY CREDENTIALS IN A SAFE PLACE *****`)
      process.exit()
    })
    .catch((err) => {
      console.error('error: ', err)
      process.exit()
    })
  })
}

function createApiKeyForUser () {
  let question = [{
    type: 'input',
    name: 'email',
    message: 'Enter user email',
    validate: (value) => {
      if (validators.isEmail(value)) {
        return true
      }
      return 'Please enter a valid email'
    }
  }]
  inquirer.prompt(question)
  .then((answer) => {
    models.Users.findOne({where: answer})
    .then((user) => {
      models.ApiKeys.findOne({where: {UserId: user.id}})
      .then((apikey) => {
        controllers.apiKeys.add({id: apikey.id})
        .then((value) => {
          console.log(`
***** CREATED APIKEY FOR USER ${answer.email} *****
${JSON.stringify(value)}
***** STORE API KEY CREDENTIALS IN A SAFE PLACE *****`)
          process.exit()
        })
        .catch((err) => {
          console.error('error: ', err)
        })
      })
      .catch((err) => {
        console.error('error: ', err)
      })
    })
    .catch((err) => {
      console.error('error: ', err)
    })
  })
}

function showUser () {
  let question = [{
    type: 'input',
    name: 'email',
    message: 'Enter user email',
    validate: (value) => {
      if (validators.isEmail(value)) {
        return true
      }
      return 'Please enter a valid email'
    }
  }]
  inquirer.prompt(question)
  .then((answer) => {
    models.Users.findOne({where: answer})
    .then((user) => {
      console.log(`
***** USER ${answer.email} *****
${JSON.stringify(user)}
*****`)
      welcome()
    })
    .catch((err) => {
      console.error('error: ', err)
    })
  })
}

function showAccount () {
  let question = [{
    type: 'input',
    name: 'email',
    message: 'Enter user email',
    validate: (value) => {
      if (validators.isEmail(value)) {
        return true
      }
      return 'Please enter a valid email'
    }
  }]
  inquirer.prompt(question)
  .then((answer) => {
    models.Users.findOne({where: answer})
    .then((user) => {
      models.Accounts.findOne({where: {UserId: user.id}})
      .then((account) => {
        console.log(`
***** ACCOUNT FOR USER ${answer.email} *****
${JSON.stringify(account)}
*****`)
        welcome()
      })
      .catch((err) => {
        console.error('error: ', err)
      })
    })
    .catch((err) => {
      console.error('error: ', err)
    })
  })
}

function updateAccountCredentials () {
  let question = [{
    type: 'input',
    name: 'accountId',
    message: 'Enter account id'
  }, {
    type: 'input',
    name: 'rutCompany',
    message: 'Enter company RUT',
    validate: (value) => {
      if (validators.isChileRut(value)) {
        return true
      }
      return 'Please enter a valid RUT: xxxxxx-x'
    }
  }, {
    type: 'input',
    name: 'rutUser',
    message: 'Enter user RUT',
    validate: (value) => {
      if (validators.isChileRut(value)) {
        return true
      }
      return 'Please enter a valid RUT: xxxxxx-x'
    }
  }, {
    type: 'password',
    name: 'password',
    message: 'Enter account password'
  }]
  inquirer.prompt(question)
  .then((answer) => {
    let newCredentials = {
      rutCompany: answer.rutCompany,
      rutUser: answer.rutUser,
      password: answer.password
    }
    models.Accounts.update({credentials: newCredentials}, {where: {id: answer.accountId}, returning: true})
    .then((account) => {
      console.log(`
***** UPDATED ACCOUNT ID ${answer.accountId} *****
${JSON.stringify(account[1][0])}
*****`)
      welcome()
    })
    .catch((err) => {
      console.error('error: ', err)
    })
  })
}

function crawlAndSaveTransactionsForAccount () {
  let question = [{
    type: 'input',
    name: 'accountId',
    message: 'Enter account id'
  }]
  inquirer.prompt(question)
  .then((answer) => {
    models.Accounts.findById(answer.accountId)
    .then((account) => {
      let opts = {
        accountId: account.id,
        rutCompany: account.credentials.rutCompany,
        rutUser: account.credentials.rutUser,
        password: account.credentials.password
      }
      getAndProcessTransactions(opts)
      .then((value) => {
        process.exit()
      })
      .catch((err) => {
        console.error('error: ', err)
      })
    })
    .catch((err) => {
      console.error('error: ', err)
    })
  })
}

function runServerForAccount () {
  let question = [{
    type: 'input',
    name: 'accountId',
    message: 'Enter account id'
  }]
  inquirer.prompt(question)
  .then((answer) => {
    runServerAndCrawl(answer.accountId)
    .then((value) => {
      console.log(`***** RUNNING SERVER AT ${value.server} FOR ACCOUNT ${value.account} *****`)
      process.exit()
    })
    .catch((err) => {
      console.error('error: ', err)
    })
  })
}
