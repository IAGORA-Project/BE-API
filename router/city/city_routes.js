const router = require('express').Router();
const CityController = require('./city_controller')
const { storeValidator } = require('../../utils/validators/cityValidator')

router.get('/get-all', CityController.getAll)
router.post('/store', storeValidator, CityController.store)

module.exports = router