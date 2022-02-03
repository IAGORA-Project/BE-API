const express = require('express');
const router = express.Router();
const path = require('path');

const controllerUpload = require('./controller_upload');

const { verifyToken, verifJWT, verifyAdmin } = require('../token');

router.get('/', (req, res) => {
    res.sendFile(path.resolve('./public/upload.html'));
})

/* WINGMAN PLOAD KTP IMAGE TO FOLDER FILE/KTP */ 

// router.post('/wingman/ktp', verifyToken, verifJWT, controllerUpload.upload_ktp, (error, req, res, next) => {
//     console.log(error)
//     res.status(400).json({
//         status: 400,
//         error: error.message
//     })
// })

/* WINGMAN UPLOAD SKCK IMAGE TO FOLDER FILE/SKCK */

// router.post('/wingman/skck', verifyToken, verifJWT, controllerUpload.upload_skck, (error, req, res, next) => {
//     console.log(error)
//     res.status(400).json({
//         status: 400,
//         error: error.message
//     })
// })

router.post('/wingman/submit-data', verifyToken, verifJWT, controllerUpload.upload_all, (error, req, res, next) => {
    console.log(error)
    res.status(400).json({
        status: 400,
        error: error.message
    })
})

router.post('/user/transaction/:id_order', verifyToken, verifJWT, controllerUpload.bukti_transaksi, (error, req, res, next) => {
    console.log(error)
    res.status(400).json({
        status: 400,
        error: error.message
    })
})

router.post('/wingman/order-completed/:id_order', verifyToken, verifJWT, controllerUpload.order_selesai, (error, req, res, next) => {
    console.log(error)
    res.status(400).json({
        status: 400,
        error: error.message
    })
})

/* WINGMAN UPLOAD PROFILE IMAGE TO FOLDER FILE/PROFILE */

router.post('/wingman/profile', verifyToken, verifJWT, controllerUpload.upload_profile_wingman, (error, req, res, next) => {
    console.log(error)
    res.status(400).json({
        status: 400,
        error: error.message
    })
})

/* USER UPLOAD PROFILE IMAGE TO FOLDER FILE/PROFILE */

router.post('/user/profile', verifyToken, verifJWT, controllerUpload.upload_profile_user, (error, req, res, next) => {
    console.log(error)
    res.status(400).json({
        status: 400,
        error: error.message
    })
})

router.post('/admin/profile', verifyToken, verifyAdmin, verifJWT, controllerUpload.upload_profile_admin, (error, req, res, next) => {
    console.log(error)
    res.status(400).json({
        status: 400,
        error: error.message
    })
})

router.post('/chat/file/:room/:user', controllerUpload.upload_file_chat, (error, req, res, next) => {
    console.log(error)
    res.status(400).json({
        status: 400,
        error: error.message
    })
})

module.exports = router