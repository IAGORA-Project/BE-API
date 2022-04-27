const { check, validationResult } = require("express-validator")
const { basicResponse } = require("../basic-response")

const storeTransaction = [
  check('recipientAddress')
    .trim()
    .notEmpty()
    .withMessage("Alamat penerima harus diisi."),
  check('shippingCosts')
    .trim()
    .notEmpty()
    .withMessage("Biaya pengiriman harus diisi."),
  check('paymentMethod')
    .trim()
    .notEmpty()
    .withMessage("Metode pembayaran harus diisi."),
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
  storeTransaction
}