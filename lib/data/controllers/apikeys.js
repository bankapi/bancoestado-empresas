'use strict'

const crypto = require('crypto')
const apiKeysModel = require('../models/').ApiKeys
const sequelize = require('../models/').sequelize
const uuid = require('node-uuid')

function verifySecret (secret, salt, secretHash) {
  console.log('saltado', saltSecret(secret, salt))
  return (saltSecret(secret, salt) === secretHash)
}

function generateSalt () {
  var sha = crypto.createHash('sha256')
  return sha.update(crypto.randomBytes(128)).digest('hex')
}

function saltSecret (key, salt) {
  return crypto.createHmac('sha256', salt).update(key).digest('hex')
}

function create (opts) {
  return new Promise((resolve, reject) => {
    if (!opts.UserId) {
      reject(new Error('UserId:required'))
    }
    let id = uuid.v4()
    let rawSecret = generateSalt()
    opts.apiSalt = generateSalt()
    opts.apiKeys = {}
    opts.apiKeys[id] = saltSecret(rawSecret, opts.apiSalt)
    // default scope
    opts.scopes = ['read']

    apiKeysModel.create(opts)
    .then((value) => {
      let result = {
        id: id,
        secret: rawSecret
      }
      resolve(result)
    })
    .catch((err) => {
      reject(err)
    })
  })
}

function add (opts) {
  return new Promise((resolve, reject) => {
    if (!opts.id) {
      reject(new Error('add:ApiKeysId:required'))
    }
    let id = uuid.v4()
    let rawSecret = generateSalt()
    apiKeysModel.findById(opts.id)
    .then((value) => {
      let salt = value.apiSalt
      let apiKeys = value.apiKeys
      apiKeys[id] = saltSecret(rawSecret, salt)
      apiKeysModel.update({apiKeys: apiKeys}, {where: {id: opts.id}})
      .then((value) => {
        let result = {
          id: id,
          secret: rawSecret
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

function verify (opts) {
  return new Promise((resolve, reject) => {
    if (!(opts.apiId || opts.apiSecret)) {
      reject(new Error('verify:apiIdAndApiSecret:required'))
    }
    let query = `select * from "ApiKeys" where "apiKeys" ? '${opts.apiId}';`

    sequelize.query(query)
    .spread((value, meta) => {
      value = value[0]
      let salt = value.apiSalt
      let apiKeys = value.apiKeys
      if (apiKeys[opts.apiId] && verifySecret(opts.apiSecret, salt, apiKeys[opts.apiId])) {
        resolve({UserId: value.UserId})
      } else {
        reject(new Error('verify:error:apiIdAndApiSecretDoNotMatch'))
      }
    })
    .catch((err) => {
      reject(err)
    })
  })
}

module.exports = {
  create: create,
  add: add,
  verify: verify
}
