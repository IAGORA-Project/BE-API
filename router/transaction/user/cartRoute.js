const { authAccess } = require('../../../middlewares/auth-middleware')
const { updateQuantityValidator } = require('../../../utils/validators/cartValidator')
const cartController = require('./cartController')

const router = require('express').Router()

router.post('/user/:userId/product/:productId/add', authAccess, cartController.addToCart)
router.post('/user/:userId/product/:productId/update-quantity', authAccess, updateQuantityValidator, cartController.updateQuantity)
router.delete('/user/:userId/product/:productId/delete-one-product', authAccess, cartController.deleteOneProductCart)
router.delete('/user/:userId/delete-all', authAccess, cartController.deleteAllCart)
router.get('/user/:userId/get', authAccess, cartController.getUserCart)

module.exports = router