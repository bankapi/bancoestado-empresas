'use strict'

const auth = require('basic-auth')
const apiKeys = require('../data/controllers').apiKeys

function secure () {
  return function* (next) {
    let credentials = auth(this)
    if (credentials && credentials.name && credentials.pass) {
      credentials.apiId = credentials.name
      credentials.apiSecret = credentials.pass
      let result = yield apiKeys.verify(credentials)
      .then((value) => {
        this.UserId = value.UserId
        return true
      })
      .catch((err) => {
        this.throw(500, err)
      })
      if (result) {
        yield next
      }
    } else {
      this.throw(401, 'Unauthorized credentials')
    }
  }
}

module.exports = secure
