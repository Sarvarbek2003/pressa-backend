const adminController = require('../controllers/admin.js')
const token = require('../middlewares/token.js')
const router = require('express').Router()

router.get('/data', token, adminController.GET)
router.put('/update',token, adminController.PUT)


module.exports = router