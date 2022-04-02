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

router.get('/find-wingman/:pasar/:kota', verifyToken, verifJWT, userTransactionController.find_wingman);
router.get('/cancel-order/:id_order', verifyToken, verifJWT, userTransactionController.cancel_order_user);
router.post('/input-saran/:id_order', verifyToken, verifJWT, userTransactionController.input_saran);
router.post('/in-transaction', verifyToken, verifJWT, userTransactionController.in_transaction);
router.get('/transaction-detail/:id_order', verifyToken, verifJWT, userTransactionController.transaction_detail);

module.exports = router