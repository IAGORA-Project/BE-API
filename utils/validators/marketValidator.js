const { check, validationResult } = require('express-validator')
const { Market } = require('../../db/Market')
const { basicResponse } = require('../basic-response')

const storeValidator = [
  check('name')
    .notEmpty()
    .withMessage("Nama pasar wajib diisi.")
    .custom(value => {
      const name = Market.find({ name: value })
      return name.exec().then(market => {
        if(market.length > 0) {
          return Promise.reject('Nama pasar sudah digunakan.')
        }
      })
    }),
  check('address')
    .notEmpty()
    .withMessage("Alamat pasar wajib diisi."),
  check('cityId')
    .isMongoId()
    .withMessage("Kota wajib diisi dan berupa ID kota yang valid."),
  (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
      return res.status(422).json(basicResponse({
        status: res.statusCode,
        message: 'Validation Errors',
        result: errors.array()
      }))
    }

    next()
  }
]

module.exports = {
  storeValidator
}