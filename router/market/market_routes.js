const router = require('express').Router();
const MarketController = require('./market_controller')
const { storeValidator } = require('../../utils/validators/marketValidator');
const { authAccess } = require('../../middlewares/auth-middleware');

router.get('/get-all', MarketController.getAll)
router.get('/:marketId/get', MarketController.getOne)
router.post('/store', authAccess, storeValidator, MarketController.store)

module.exports = router