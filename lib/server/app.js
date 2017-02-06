'use strict'
const controllers = require('./controllers/')
const compress = require('koa-compress')
const logger = require('koa-logger')
const router = require('koa-router')()
const koa = require('koa')
const app = koa()
const apiAuth = require('./apiAuth')

// Logger
app.use(logger())

// auth
app.use(apiAuth())

// define routes
router.get('/transactions/', controllers.transactions.getTransactionsForUser)

app.use(router.routes())

// Compress
app.use(compress())

if (!module.parent) {
  app.listen(1337)
  console.log('listening on port 1337')
} else {
  module.exports = app
}
