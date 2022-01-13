const express = require('express');
const router = express.Router();

const controllerProduct = require('./controller_product')

const { verifyToken, verifJWT } = require('../token');

router.get('/', (req, res) => {
    res.send('ada')
})

/* CREATE PRODUCT */

router.post('/create-product', verifyToken, controllerProduct.create_product);

/* CREATE PRODUCT */

router.get('/read-one-product/:ids', verifyToken, controllerProduct.product_one);

/* CREATE PRODUCT */

router.get('/read-all-product', verifyToken, controllerProduct.product_all);

/* CREATE PRODUCT */

router.post('/update-product/:ids', verifyToken, controllerProduct.product_update);

/* CREATE PRODUCT */

router.get('/delete-one-product/:ids', verifyToken, controllerProduct.delete_one_product);

/* CREATE PRODUCT */

router.get('/delete-all-product', verifyToken, controllerProduct.delete_all_product);

module.exports = router