const express = require('express');
const router = express.Router();

const { authAccess } = require('../../middlewares/auth-middleware');
const ProductCategoryController = require('./product_category_controller') 
const { createProductCategoryValidator } = require('../../utils/validators/prodoctValidator');

/* CREATE PRODUCT Category */

router.post('/store', createProductCategoryValidator, ProductCategoryController.store);

// /* GET ALL PRODUCT CATEGORY */

router.get('/get-all', ProductCategoryController.getAll);

module.exports = router