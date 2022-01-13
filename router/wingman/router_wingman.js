const express = require('express');
const router = express.Router();
const path = require('path');

const controllerWingman = require('./contoller_wingman');
const { verifyToken, verifJWT } = require('../token');

router.get('/', verifJWT, controllerWingman.router_wingman);

/* DATA WINGMAN */

router.get('/wingman-data', verifyToken, verifJWT, controllerWingman.data_wingman)

/* SEND OTP */

router.get('/send-otp-wingman', (req, res) => {
    res.sendFile(path.resolve('./public/nohp.html'));
})
router.post('/send-otp-wingman', verifyToken, controllerWingman.send_otp);

/* LOGIN WITH OTP */

router.get('/login-wingman', (req, res) => {
    res.sendFile(path.resolve('./public/loginhp.html'));
})
router.post('/login-wingman', verifyToken,  controllerWingman.login_wingman);

/* REGSITER IF USER.NAME = null */

router.get('/register-wingman', verifyToken,  verifJWT, controllerWingman.regsiter_wingman);

/* SUBMIT DATA WINGMAN BEFORE WRITE IN DB */

router.get('/submit-data', (req, res) => {
    res.sendFile(path.resolve('./public/regwingman.html'));
})
router.post('/submit-data', verifyToken,  verifJWT, controllerWingman.submit_data);

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

router.get('/delete-all-wingman', verifyToken, controllerWingman.delete_all_wingman);

module.exports = router