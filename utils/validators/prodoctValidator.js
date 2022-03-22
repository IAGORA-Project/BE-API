const { check, validationResult } = require('express-validator')
const { Product } = require('../../db/Product')
const { ProductCategory } = require('../../db/ProductCategory')
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
  check('product_category_id')
    .isMongoId()
    .withMessage("Kategori produk wajib diisi dan harus ID yang valid."),
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

const createProductCategoryValidator = [
  check('name')
    .notEmpty()
    .withMessage("Nama kategori wajib diisi.")
    .custom(value => {
      const name = ProductCategory.find({ name: value })
      return name.exec().then(productCategories => {
        if(productCategories.length > 0) {
          return Promise.reject('Nama kategory tidak boleh sama.')
        }
      })
    }),
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
  createProductValidator,
  createProductCategoryValidator
}