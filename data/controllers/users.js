'use strict'

const usersModel = require('../models/').Users
const apiKeysController = require('./apikeys')

function create (opts) {
  return new Promise((resolve, reject) => {
    usersModel.create(opts)
    .then((user) => {
      apiKeysController.create({UserId: user.id})
      .then((key) => {
        let result = {
          user: user.get({plain: true}),
          apiKey: key
        }
        resolve(result)
      })
      .catch((err) => {
        reject(err)
      })
    })
    .catch((err) => {
      reject(err)
    })
  })
}

module.exports = {
  create: create
}
