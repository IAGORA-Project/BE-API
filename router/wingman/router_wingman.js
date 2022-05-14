const express = require('express');
const router = express.Router();
const path = require('path');

const controllerWingman = require('./contoller_wingman');
const WingmanRequestController = require('./wingman_request_controller')
const { verifyToken, verifJWT } = require('../token');
const { Wingman } = require('../../db/Wingman');
const {
    sendOtpValidator,
    verifyOtpValidator,
    completeWingmanDetailValidator,
    completeWingmanDocumentValidator,
    requestNewProductValidator,
    requestNewMarketValidator
} = require('../../utils/validators/wingmanValidator');
const { authAccess, authRefresh } = require('../../middlewares/auth-middleware');
const { wingmanDocumentUpload } = require('../../utils/image-uploads/wingman/document');
const { productUpload } = require('../../utils/image-uploads/product');

// router.get('/', verifJWT, controllerWingman.router_wingman);

router.get('/', async (req, res) => {
    let data = await Wingman.find({});
    res.render('ejs/wingman', {
        result: data
    })
})

/* DATA WINGMAN */

router.get('/get-access-token', authRefresh, controllerWingman.getAccessToken)

/* SEND OTP */

router.post('/send-otp-wingman', sendOtpValidator, controllerWingman.send_otp_wingman);

/* LOGIN WITH OTP */

router.post('/verify-otp', verifyOtpValidator,  controllerWingman.verifyOtp);

/* COMPLETE WINGMAN DETAIL */

router.put('/:wingmanId/complate-wingman-detail', authAccess, completeWingmanDetailValidator, controllerWingman.complateWingmanDetail);

/* COMPLETE WINGMAN DOCUMENT */

router.put('/:wingmanId/complate-wingman-document', authAccess, wingmanDocumentUpload.fields([{ name: 'ktp', maxCount: 1 }, { name: 'skck', maxCount: 1 }]), completeWingmanDocumentValidator, controllerWingman.complateWingmanDocument);

/* REGSITER IF USER.NAME = null */

router.get('/register-wingman', verifyToken,  verifJWT, controllerWingman.regsiter_wingman);

/* SUBMIT DATA WINGMAN BEFORE WRITE IN DB */

router.get('/submit-data', (req, res) => {
    res.sendFile(path.resolve('./public/regwingman.html'));
})
// router.post('/submit-data', verifyToken,  verifJWT, controllerWingman.submit_data);

/* PREVIEW BEFORE WRITE IN DB */

router.get('/preview-wingman', verifyToken,  verifJWT, controllerWingman.preview_data);

/* DELETE USER.NAME = null IN DB */

router.post('/delete-submit', verifyToken, controllerWingman.delete_submit_data);

/* DELETE WINGMAN IN DB */

router.post('/delete-wingman', verifyToken, controllerWingman.delete_wingman_data);

/* LOGOUT */

router.get('/logout-wingman', verifyToken, verifJWT, controllerWingman.logout_wingman);

/* SWITCH AVAILABLE */

router.get('/switch-available', verifyToken, verifJWT, controllerWingman.switch_available);

/* EDIT ORDER TODAY */

router.post('/edit-today-order/:action', verifyToken, verifJWT, controllerWingman.edit_order_today);

/* EDIT ORDER TOTAL */

router.post('/edit-total-order/:action', verifyToken, verifJWT, controllerWingman.edit_order_total);

/* EDIT INCOME WINGMAN */

router.post('/edit-income/:action', verifyToken, verifJWT, controllerWingman.edit_income);

/* CHANGE DATA WINGMAN */

router.post('/change-data-wingman', verifyToken, verifJWT, controllerWingman.change_data_wingman);

/* DELETE ALL WINGMAN */

router.delete('/delete-all-wingman', verifyToken, controllerWingman.delete_all_wingman);

/* DELETE ONE WINGMAN IN DB */

router.delete('/:wingmanId/delete-one-wingman', authAccess, controllerWingman.delete_one_wingman);

/* Input PIN */

router.post('/input-pin', verifyToken, verifJWT, controllerWingman.input_Pin);

/* PIN WINGMAN */

router.post('/enter-pin', verifyToken, controllerWingman.enterPIN);

// Wingman request new product
router.post('/request-new-product', authAccess, productUpload.single('product_image'), requestNewProductValidator, WingmanRequestController.requestNewProduct)

// Wingman request new market
router.post('/request-new-market', authAccess, requestNewMarketValidator, WingmanRequestController.requestNewMarket)

module.exports = router