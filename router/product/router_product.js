const express = require('express');
const router = express.Router();

const controllerProduct = require('./controller_product')
const { createProductValidator } = require('../../utils/validators/prodoctValidator');
const { productUpload } = require('../../utils/image-uploads/product');
const { authAccess } = require('../../middlewares/auth-middleware');

/* CREATE PRODUCT */

router.post('/create-product', productUpload.single('product_image'), createProductValidator, controllerProduct.store);

/* CREATE PRODUCT */

router.get('/get-all', controllerProduct.getAll);

/* CREATE PRODUCT */

router.get('/:productId/get', controllerProduct.getOne);

module.exports = router