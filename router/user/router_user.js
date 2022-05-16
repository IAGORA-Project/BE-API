const express = require('express');
const { User } = require('../../db/User');
const { authRefresh, authAccess } = require('../../middlewares/auth-middleware');
const { userUpload } = require('../../utils/image-uploads/user');
const { sendOtpValidator, verifyOtpValidator, completeRegisterValidator } = require('../../utils/validators/userValidator');
const { verifyToken, verifJWT } = require('../token');
const router = express.Router();

const controllerUser = require('./controller_user');

// router.get('/', verifJWT, controllerUser.router_user); 
// router.get('/', async (req, res) => {
//     let data = await User.find({});
//     res.render('ejs/user', {
//         result: data
//     })
// })


/* GET ACCESS TOKEN USER */

router.get('/get-access-token', authRefresh, controllerUser.getAccessToken)

/* DATA USER */

router.get('/get-data', authAccess, controllerUser.getUserData)

/* UPDATE DATA USER */

router.put('/update-data', authAccess, userUpload.single('avatar'), controllerUser.updateUserData)

/* SEND OTP USER */

router.post('/send-otp-user', sendOtpValidator, controllerUser.send_otp_user);

/* LOGIN VIA OTP USER*/

router.post('/verify-otp', verifyOtpValidator, controllerUser.verifyOtp);

/* CHANGE DATA USER*/

router.put('/:userId/complete-registration', authAccess, completeRegisterValidator, controllerUser.completeRegistration);

/* Add Address */

router.put('/add-address', authAccess, controllerUser.addAddress);

/* Delete Address */

router.delete('/delete-address', authAccess, controllerUser.deleteAddress);

/* Set Checkout Address */

router.put('/checkout-address', authAccess, controllerUser.setCheckoutAddress);

/* DELETE ONE User IN DB */

router.delete('/:userId/delete-one-user', authAccess, controllerUser.delete_one_user);

module.exports = router