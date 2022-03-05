const { check, validationResult } = require('express-validator')
const { basicResponse } = require('../basic-response')
const { City } = require('../../db/City')

const storeValidator = [
  check('name')
    .notEmpty()
    .withMessage("Nama kota harus diisi.")
    .custom(value => {
      const name = City.find({ name: value })
      return name.exec().then(city => {
        if(city.length > 0) {
          return Promise.reject('Nama pasar sudah digunakan.')
        }
      })
    }),
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