'use strict'

const validator = require('validator')

function isChileRut (string) {
  // validate chilean rut
  var rexp = new RegExp(/^([0-9])+\-([kK0-9])+$/)

  if (rexp.test(string)) {
    var RUT = string.split('-')
    var elRut = RUT[0]
    var factor = 2
    var suma = 0
    var dv
    for (var i = (elRut.length - 1); i >= 0; i--) {
      factor = factor > 7 ? 2 : factor
      suma += parseInt(elRut[i], 10) * parseInt(factor++, 10)
    }
    dv = 11 - (suma % 11)
    if (dv === 11) {
      dv = 0
    } else if (dv === 10) {
      dv = 'k'
    } if (dv.toString() === RUT[1].toLowerCase() && (elRut !== '11111111')) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

validator.isChileRut = isChileRut

module.exports = validator
