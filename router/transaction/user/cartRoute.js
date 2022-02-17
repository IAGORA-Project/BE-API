const { updateQuantityValidator } = require('../../../utils/validators/cartValidator')
const cartController = require('./cartController')

const router = require('express').Router()

router.post('/user/:userId/product/:productId/add', cartController.addToCart)
router.post('/user/:userId/product/:productId/update-quantity', updateQuantityValidator, cartController.updateQuantity)
router.delete('/user/:userId/product/:productId/delete-one-product', cartController.deleteOneProductCart)
router.delete('/user/:userId/delete-all', cartController.deleteAllCart)
router.get('/user/:userId/get', cartController.getUserCart)

module.exports = router