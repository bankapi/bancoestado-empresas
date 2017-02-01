'use strict'

const users = require('./users')
const apiKeys = require('./apikeys')

let bind = function (controller, property) {
  module.exports[property] = controller
}

bind(users, 'users')
bind(apiKeys, 'apiKeys')
