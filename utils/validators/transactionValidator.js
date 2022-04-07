const { check, validationResult } = require("express-validator")
const { basicResponse } = require("../basic-response")

const checkoutValidator = [
  check('tip')
    .trim()
    .notEmpty()
    .withMessage("Tip harus diisi."),
  check('notes')
    .isArray()
    .withMessage("Notes harus diisi dan harus berupa array."),
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
  checkoutValidator
}