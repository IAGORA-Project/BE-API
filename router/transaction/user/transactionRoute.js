const express = require('express');
const { authAccess } = require('../../../middlewares/auth-middleware');
const { checkoutValidator } = require('../../../utils/validators/transactionValidator');
const { verifyToken, verifJWT } = require('../../token');
const router = express.Router();

const userTransactionController = require('./transactionController');

// CheckOut Routes
router.post('/:userId/checkout', authAccess, checkoutValidator, userTransactionController.checkout);
router.get('/:userId/checkout', authAccess, userTransactionController.getCheckout);
router.delete('/:userId/checkout/cancel', authAccess, userTransactionController.cancelCheckout);

module.exports = router