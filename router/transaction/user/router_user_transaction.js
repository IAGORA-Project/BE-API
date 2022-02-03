const express = require('express');
const { verifyToken, verifJWT } = require('../../token');
const router = express.Router();

const controllerUser = require('./controller_user_transaction');

router.post('/add-cart', verifyToken, verifJWT, controllerUser.add_cart);

router.get('/delete-cart/:id_product', verifyToken, verifJWT, controllerUser.delete_cart);

router.get('/mark-cart/:id_product/:status', verifyToken, verifJWT, controllerUser.mark_product_cart);

router.post('/edit-quantity', verifyToken, verifJWT, controllerUser.edit_quantity);

router.get('/in-cart', verifyToken, verifJWT, controllerUser.in_cart);

router.get('/find-wingman/:pasar/:kota', verifyToken, verifJWT, controllerUser.find_wingman);

router.get('/cancel-order/:id_order', verifyToken, verifJWT, controllerUser.cancel_order_user);

router.post('/input-saran/:id_order', verifyToken, verifJWT, controllerUser.input_saran);

router.post('/in-transaction', verifyToken, verifJWT, controllerUser.in_transaction);

router.get('/transaction-detail/:id_order', verifyToken, verifJWT, controllerUser.transaction_detail);

module.exports = router