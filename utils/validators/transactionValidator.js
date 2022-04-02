const { check, validationResult } = require("express-validator")
const { basicResponse } = require("../basic-response")

const checkoutValidator = [
  check('tip')
    .trim()
    .notEmpty()
    .withMessage("Tip harus diisi."),
  check('recipientAddress')
    .trim()
    .notEmpty()
    .withMessage("Alamat penerima harus diisi."),
  check('shippingCost')
    .trim()
    .notEmpty()
    .withMessage("Biaya pengiriman harus diisi."),
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