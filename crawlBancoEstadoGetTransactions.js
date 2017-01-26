'use strict'

const Nightmare = require('nightmare')
require('nightmare-iframe-manager')(Nightmare)
require('nightmare-download-manager')(Nightmare)
const _ = require('lodash')
const path = require('path')
const co = require('co')
const nightmare = Nightmare()

// Format date according to banco estado
let date = new Date()
let month = date.getMonth() > 8 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
let day = date.getDate() > 9 ? date.getDate() : '0' + date.getDate()
let today = day + '/' + month + '/' + date.getFullYear()

// transaction type
let transactionType = 'outgoing'

nightmare.on('download', function (state, downloadItem) {
  if (state === 'started') {
    nightmare.emit('download', path.resolve('./downloads') + '/' + transactionType + '/' + _.now() + '.html', downloadItem)
  }
})

// generator functions
let login = function* () {
  let result = yield nightmare
  .goto('https://personas.bancoestado.cl/bancoestado/CajaLoginLocal.Html')
  .wait('input[id="chkEmpresas"]')
  .click('input[id="chkEmpresas"]')
  .insert('input[id="CustPermIDAux"]', '76373918K')
  .insert('input[id="CustLoginIDAux"]', '157715003')
  .insert('input[id="SignonPswdAux"]', 'TnPs50G5')
  .click('input[id="enviar"]')
  .wait('frame[name="left"]')
  .enterIFrame('frame[name="left"]')
  .wait('#ntMenu0nb')
  .click('#ntMenu0nb')
  .click('a[href*="bancoestado/process.asp?MID=3106"]')
  .exitIFrame()
  .enterIFrame('frame[name="main"]')
  .wait('#hdnFechaI')
  .exists('#hdnFechaI')
  .then((exists) => {
    if (exists) {
      return true
    } else {
      throw new Error('login:error')
    }
  })

  return result
}

let getTransactions = function* (type) {
  type = type === 'outgoing' ? '1' : '2'
  let result = yield nightmare
  .evaluate(function (query) {
    // now we're executing inside the browser scope.
    document.querySelector('input[name="hdnFechaI"]').removeAttribute('disabled')
    document.querySelector('input[name="hdnFechaT"]').removeAttribute('disabled')
    let init = document.querySelector('input[name="hdnFechaI"]')
    init.value = query
    let end = document.querySelector('input[name="hdnFechaT"]')
    end.value = query
  }, today)
  .select('select[name="TipoCart"]', type)
  .click('input[name="Continuar"]')
  .wait(1000) // this step should be done according to some reference on the site, not an arbitrary time..maybe request ended?
  .exists('img[src="imagesEmpresas/boton_salvar.gif"]')
  .then((exists) => {
    if (!exists) {
      return nightmare
      .click('img[src="ImagesPersonas/boton_volver_nar.gif"]')
      .wait('#hdnFechaI')
      .then(() => {
        // no transactions
        return false
      })
    } else {
      return true
    }
  })

  return result
}

let downloadTransactions = function* (doIt) {
  if (!doIt) {
    // nothing to download
    return true
  }

  let result = yield nightmare
  .downloadManager()
  .wait('img[src="imagesEmpresas/boton_salvar.gif"]')
  .click('img[src="imagesEmpresas/boton_salvar.gif"]')
  .waitDownloadsComplete()
  .click('input[name="volver"]')
  .wait('#hdnFechaI')
  .then(() => {
    return true
  })

  return result
}

let ender = function* () {
  return yield nightmare.end()
}

function crawlBancoEstadoGetTransactions () {
  return new Promise((resolve, reject) => {
    // run generators
    co(login)
    .then(() => {
      co(getTransactions(transactionType))
      .then((result) => {
        co(downloadTransactions(result))
        .then(() => {
          transactionType = 'incoming'
          co(getTransactions(transactionType))
          .then((result) => {
            co(downloadTransactions(result))
            .then(() => {
              co(ender)
              .then(() => {
                console.log('done')
                resolve(true)
              }, (err) => {
                co(ender).then(reject(err))
              })
            }, (err) => {
              co(ender).then(reject(err))
            })
          }, (err) => {
            co(ender).then(reject(err))
          })
        }, (err) => {
          co(ender).then(reject(err))
        })
      }, (err) => {
        co(ender).then(reject(err))
      })
    }, (err) => {
      co(ender).then(reject(err))
    })
  })
}

module.exports = crawlBancoEstadoGetTransactions
