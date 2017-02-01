'use strict'

const users = require('./users')
const apiKeys = require('./apikeys')
const accounts = require('./accounts')

let bind = function (controller, property) {
  module.exports[property] = controller
}

bind(users, 'users')
bind(apiKeys, 'apiKeys')
bind(accounts, 'accounts')
