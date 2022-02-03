const express = require('express');
const { Admin } = require('../../db/Admin');
const { Wingman } = require('../../db/Wingman');
const { verifyToken, verifJWT, verifyAdmin } = require('../token');
const router = express.Router();

const controllerAdmin = require('./controller_admin');

router.get('/belum-dibayar-2', async (req, res) => {
    let { status } = req.query;
    let statusFix = status ? status : ['4']
    let findAll = await Wingman.find({})
    let arr = []
    for (let i = 0; i < findAll.length; i++) {
        for (let j = 0; j < statusFix.length; j++) {
            let find = findAll[i].on_process.filter(x => x.status == statusFix[j]);
            for (let i = 0; i < find.length; i++) {
                arr.push(find[i])
            }
        }
    }
    res.render('ejs/belum_bayar', {
        result: arr
    })
})

router.get('/', async (req, res) => {
    let data = await Admin.find({});
    res.render('ejs/admin', {
        result: data
    })
})

router.post('/register-admin', verifyToken, controllerAdmin.register_admin);

router.post('/login-admin', verifyToken, controllerAdmin.login_admin);

router.get('/check-admin', verifyToken, verifyAdmin, verifJWT, controllerAdmin.check_admin);

router.post('/change-data-admin', verifyToken, verifyAdmin, verifJWT, controllerAdmin.change_data_admin);

router.get('/delete-one-admin/:id_admin', verifyToken, controllerAdmin.delete_one_admin)

router.get('/status-bayar/:id_order', verifyToken, verifyAdmin, verifJWT, controllerAdmin.status_dibayar);

router.post('/belum-dibayar', verifyToken, verifyAdmin, verifJWT, controllerAdmin.in_belumBayar);

router.get('/delete-order/:id_order/:id/:type', verifyToken, verifyAdmin, verifJWT, controllerAdmin.delete_order);

router.post('/add-income', verifyToken, verifyAdmin, verifJWT, controllerAdmin.add_income_wingman);

module.exports = router