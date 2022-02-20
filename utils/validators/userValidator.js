const { check, validationResult } = require('express-validator')
const { basicResponse } = require('../basic-response')

const sendOtpValidator = [
  check('no_hp')
    .notEmpty()
    .withMessage("Nomor handphone wajib diisi."),
  (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
      return res.status(422).json(basicResponse({
        status: res.statusCode,
        message: 'Validation errors!',
        result: errors.array()
      }))
    }

    next()
  }
]

const verifyOtpValidator = [
  check('no_hp')
    .notEmpty()
    .withMessage("Nomor handphone wajib diisi."),
  check('otp_code')
    .notEmpty()
    .withMessage("Kode OTP wajib diisi."),
  (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
      return res.status(422).json(basicResponse({
        status: res.statusCode,
        message: 'Validation Errors!',
        result: errors.array()
      }))
    }

    next()
  }
]

module.exports = {
  sendOtpValidator,
  verifyOtpValidator
}