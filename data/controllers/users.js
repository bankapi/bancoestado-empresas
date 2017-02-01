'use strict'

const models = require('../models/')
const apiKeysController = require('./apikeys')
const isChileRut = require('../validators').isChileRut

function create (opts) {
  return new Promise((resolve, reject) => {
    if (!(opts.email && opts.credentials && isChileRut(opts.credentials.rutCompany) && isChileRut(opts.credentials.rutUser) && opts.credentials.password)) {
      return reject(new Error('required email and credentials:rutCompany,rutUser,password'))
    }

    models.Users.create(opts)
    .then((user) => {
      opts.UserId = user.id
      apiKeysController.create(opts)
      .then((key) => {
        models.Accounts.create(opts)
        .then((account) => {
          let result = {
            user: user.get({plain: true}),
            apiKey: key,
            account: account.get({plain: true})
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
    .catch((err) => {
      reject(err)
    })
  })
}

module.exports = {
  create: create
}
