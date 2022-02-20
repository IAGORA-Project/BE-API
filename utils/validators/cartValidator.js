const { check, validationResult } = require('express-validator')
const { basicResponse } = require('../basic-response')

const updateQuantityValidator = [
  check('quantity')
    .notEmpty()
    .withMessage("Quantity harus diisi."),
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
  updateQuantityValidator
}