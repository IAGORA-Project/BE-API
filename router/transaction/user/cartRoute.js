const { accessUser } = require('../../../middlewares/auth-middleware')
const { updateQuantityValidator } = require('../../../utils/validators/cartValidator')
const cartController = require('./cartController')

const router = require('express').Router()

router.post('/user/:userId/product/:productId/add', accessUser, cartController.addToCart)
router.post('/user/:userId/product/:productId/update-quantity', accessUser, updateQuantityValidator, cartController.updateQuantity)
router.delete('/user/:userId/product/:productId/delete-one-product', accessUser, cartController.deleteOneProductCart)
router.delete('/user/:userId/delete-all', accessUser, cartController.deleteAllCart)
router.get('/user/:userId/get', accessUser, cartController.getUserCart)

module.exports = router