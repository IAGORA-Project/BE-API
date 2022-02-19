const express = require('express');
const { User } = require('../../db/User');
const { sendOtpValidator, verifyOtpValidator } = require('../../utils/validators/userValidator');
const { verifyToken, verifJWT } = require('../token');
const router = express.Router();

const controllerUser = require('./controller_user');

// router.get('/', verifJWT, controllerUser.router_user); 
router.get('/', async (req, res) => {
    let data = await User.find({});
    res.render('ejs/user', {
        result: data
    })
})


/* DATA USER */

router.get('/user-data', verifyToken, verifJWT, controllerUser.data_user)

/* SEND OTP USER */

router.post('/send-otp-user', sendOtpValidator, controllerUser.send_otp_user);

/* LOGIN VIA OTP USER*/

router.post('/verify-otp', verifyOtpValidator, controllerUser.verifyOtp);

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

/* Input PIN */

router.post('/input-pin', verifyToken, verifJWT, controllerUser.input_Pin);

/* LOGIN PIN */

router.post('/enter-pin', verifyToken, controllerUser.enterPin);

module.exports = router