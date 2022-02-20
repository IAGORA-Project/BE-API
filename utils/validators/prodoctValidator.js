const { check, validationResult } = require('express-validator')
const { Product } = require('../../db/Product')
const { basicResponse } = require('../basic-response')

const createProductValidator = [
  check('product_name')
    .notEmpty()
    .withMessage("Nama produk wajib diisi.")
    .custom(value => {
      const name = Product.find({ product_name: value })
      return name.exec().then(product => {
        if(product.length > 0) {
          return Promise.reject('Nama produk tidak boleh sama.')
        }
      })
    }),
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
  createProductValidator
}