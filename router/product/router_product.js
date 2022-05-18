const express = require('express');
const router = express.Router();

const controllerProduct = require('./controller_product')
const { createProductValidator, createProductCategoryValidator, createProductGradeValidator, updateProductGradeValidator } = require('../../utils/validators/productValidator');
const { productUpload } = require('../../utils/image-uploads/product');
const { authAccess } = require('../../middlewares/auth-middleware');
const ProductCategoryController = require('./product_category_controller') 
const ProductGradeController = require('./product_grade_controller') 

// PRODUCT ROUTES

router.post('/create-product', productUpload.single('product_image'), createProductValidator, controllerProduct.store);
router.get('/get-all', controllerProduct.getAll);
router.get('/:productId/get', controllerProduct.getOne);
router.get('/get-specific-product', controllerProduct.getSpecificProduct);

// PRODUCT CATEGORY ROUTES

router.post('/category/store', createProductCategoryValidator, ProductCategoryController.store);
router.get('/category/get-all', ProductCategoryController.getAll);

// PRODUCT GRADE ROUTES

router.post('/grade/store', createProductGradeValidator, ProductGradeController.store);
router.put('/grade/:productGradeId/update', updateProductGradeValidator, ProductGradeController.update);
router.get('/grade/get-all', ProductGradeController.getAll);

module.exports = router