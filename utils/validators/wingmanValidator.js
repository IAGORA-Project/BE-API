const { check, validationResult } = require('express-validator')
const { Market } = require('../../db/Market')
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

const completeWingmanDetailValidator = [
  check('name')
    .notEmpty()
    .withMessage("Nama lengkap wajib diisi."),
  check('email')
    .isEmail()
    .withMessage("Alamat email wajib diisi dan harus email yang valid."),
  check('address')
    .notEmpty()
    .withMessage("Alamat lengkap wajib diisi."),
  check('city')
    .notEmpty()
    .withMessage("Kota anda wajib diisi."),
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

const completeWingmanDocumentValidator = [
  check('bank')
    .notEmpty()
    .withMessage("Nama bank wajib diisi."),
  check('no_rek')
    .notEmpty()
    .withMessage("Nomor rekening wajib diisi."),
  check('nama_rek')
    .notEmpty()
    .withMessage("Nama rekening wajib diisi."),
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

const requestNewProductValidator = [
  check('product_name')
    .notEmpty()
    .withMessage("Nama produk wajib diisi."),
  check('product_category')
    .notEmpty()
    .withMessage("Kategori produk wajib diisi."),
  check('product_grade')
    .isIn(['A', 'B', 'C'])
    .withMessage("Masukkan grade A, B, atau C."),
  check('product_price')
    .notEmpty()
    .withMessage("Harga produk wajib diisi."),
  check('product_uom')
    .notEmpty()
    .withMessage("UOM produk wajib diisi."),
  check('marketId')
    .isMongoId()
    .withMessage("ID market wajib diisi."),
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

const requestNewMarketValidator = [
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
  sendOtpValidator,
  verifyOtpValidator,
  completeWingmanDetailValidator,
  completeWingmanDocumentValidator,
  requestNewProductValidator,
  requestNewMarketValidator
}