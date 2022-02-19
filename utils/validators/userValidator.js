const { check, validationResult } = require('express-validator')

const sendOtpValidator = [
  check('no_hp')
    .notEmpty()
    .withMessage("Nomor handphone wajib diisi."),
  (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
      return res.status(422).json({ validationErrors: errors.array() })
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
      return res.status(422).json({ validationErrors: errors.array() })
    }

    next()
  }
]

module.exports = {
  sendOtpValidator,
  verifyOtpValidator
}