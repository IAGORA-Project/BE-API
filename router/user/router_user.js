const express = require('express');
const { verifyToken, verifJWT } = require('../token');
const router = express.Router();

const controllerUser = require('./controller_user');

router.get('/', verifJWT, controllerUser.router_user); 

/* DATA USER */

router.get('/user-data', verifyToken, verifJWT, controllerUser.data_user)

/* SEND OTP USER */

router.post('/send-otp-user', verifyToken, controllerUser.send_otp_user);

/* LOGIN VIA OTP USER*/

router.post('/login-user', verifyToken, controllerUser.login_user);

/* REGISTER USER*/

router.post('/register-user', verifyToken, verifJWT, controllerUser.register_user);

/* CHANGE DATA USER*/

router.post('/change-data-user', verifyToken, verifJWT, controllerUser.change_data_user);

/* LOGOUT USER*/

router.get('/logout-user', verifyToken, verifJWT, controllerUser.logout_user);

/* DELETE USER*/

router.post('/delete-user', verifyToken, controllerUser.delete_user);

/* DELETE ALL USER*/

router.get('/delete-all-user', verifyToken, controllerUser.delete_all_user);

module.exports = router