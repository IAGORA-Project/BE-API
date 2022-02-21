const express = require('express');
const { User } = require('../../db/User');
const { accessUser, refreshUser } = require('../../middlewares/auth-middleware');
const { userUpload } = require('../../utils/image-upload');
const { sendOtpValidator, verifyOtpValidator, completeRegisterValidator } = require('../../utils/validators/userValidator');
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


/* GET ACCESS TOKEN USER */

router.get('/:userId/get-access-token', refreshUser, controllerUser.getAccessToken)

/* DATA USER */

router.get('/user-data', verifyToken, verifJWT, controllerUser.data_user)

/* SEND OTP USER */

router.post('/send-otp-user', sendOtpValidator, controllerUser.send_otp_user);

/* LOGIN VIA OTP USER*/

router.post('/verify-otp', verifyOtpValidator, controllerUser.verifyOtp);

/* CHANGE DATA USER*/

router.put('/:userId/complete-registration', accessUser, userUpload().single('avatar'), completeRegisterValidator, controllerUser.completeRegistration);

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