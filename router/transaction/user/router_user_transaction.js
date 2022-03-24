const express = require('express');
const { authAccess } = require('../../../middlewares/auth-middleware');
const { verifyToken, verifJWT } = require('../../token');
const router = express.Router();

const controllerUser = require('./controller_user_transaction');

// CheckOut Routes
router.post('/:userId/checkout', authAccess, controllerUser.find_wingman);

router.get('/find-wingman/:pasar/:kota', verifyToken, verifJWT, controllerUser.find_wingman);
router.get('/cancel-order/:id_order', verifyToken, verifJWT, controllerUser.cancel_order_user);
router.post('/input-saran/:id_order', verifyToken, verifJWT, controllerUser.input_saran);
router.post('/in-transaction', verifyToken, verifJWT, controllerUser.in_transaction);
router.get('/transaction-detail/:id_order', verifyToken, verifJWT, controllerUser.transaction_detail);

module.exports = router