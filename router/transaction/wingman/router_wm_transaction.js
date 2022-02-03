const express = require('express');
const { verifyToken, verifJWT } = require('../../token');
const router = express.Router();

const controllerWM = require('./controller_wm_transaction');

router.get('/accept-order', verifyToken, verifJWT, controllerWM.accept_order);

router.post('/in-process', verifyToken, verifJWT, controllerWM.in_process); // CEK ALL USER IN STATUS_PROSES

router.get('/process-order/:id_order', verifyToken, verifJWT, controllerWM.process_order_detail); // CEK ONE USER STATUS_PROSES

router.post('/tawar-order/:id_order', verifyToken, verifJWT, controllerWM.menawar);

router.get('/delete-tawar/:id_order/:id_product', verifyToken, verifJWT, controllerWM.delete_product_tawar);

router.post('/add-tawar', verifyToken, verifJWT, controllerWM.add_product_tawar);

router.post('/edit-tawar', verifyToken, verifJWT, controllerWM.edit_quantity_tawar);

router.get('/change-status/:id_order', verifyToken, verifJWT, controllerWM.change_status);

module.exports = router;