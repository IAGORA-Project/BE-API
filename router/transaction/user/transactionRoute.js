const express = require('express');
const { authAccess } = require('../../../middlewares/auth-middleware');
const { checkoutValidator, storeTransaction } = require('../../../utils/validators/transactionValidator');
const router = express.Router();

const userTransactionController = require('./transactionController');

// CheckOut Routes
router.post('/:userId/checkout', authAccess, userTransactionController.checkout);
router.get('/:userId/checkout', authAccess, userTransactionController.getCheckout);
router.delete('/:userId/checkout/cancel', authAccess, userTransactionController.cancelCheckout);

// Transaction Routes
router.post('/:userId', authAccess, storeTransaction, userTransactionController.transaction);

module.exports = router