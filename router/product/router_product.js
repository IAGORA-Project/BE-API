const express = require('express');
const router = express.Router();

const controllerProduct = require('./controller_product')

const { verifyToken, verifJWT } = require('../token');
const { Product } = require('../../db/Product');
const { productUpload } = require('../../utils/image-upload');
const { createProductValidator } = require('../../utils/validators/prodoctValidator');

router.get('/', async (req, res) => {
    const data = await Product.find({});
    res.render('ejs/product', {
        result: data
    })
})

/* CREATE PRODUCT */

router.post('/create-product', productUpload().single('product_image'), createProductValidator, controllerProduct.create_product);

/* CREATE PRODUCT */

router.get('/read-one-product/:ids', verifyToken, controllerProduct.product_one);

/* CREATE PRODUCT */

router.get('/read-all-product', verifyToken, controllerProduct.product_all);

/* CREATE PRODUCT */

router.put('/update-product/:ids', verifyToken, productUpload().single('product_image'), controllerProduct.product_update);

/* CREATE PRODUCT */

router.delete('/delete-one-product/:ids', verifyToken, controllerProduct.delete_one_product);

/* CREATE PRODUCT */

router.delete('/delete-all-product', verifyToken, controllerProduct.delete_all_product);

module.exports = router