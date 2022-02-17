const { check, validationResult } = require('express-validator')

const updateQuantityValidator = [
  check('quantity')
    .notEmpty()
    .withMessage("Quantity harus diisi."),
  (req, res, next) => {
    const errors = validationResult(req)

    if(!errors.isEmpty()) {
      return res.status(422).json({ validationErrors: errors.array() })
    }

    next()
  }
]

module.exports = {
  updateQuantityValidator
}