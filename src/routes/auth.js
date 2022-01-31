const controller = require('../controllers/auth.js')

const router = require('express').Router()

router.post('/login', controller.LOGIN)
router.post('/code', controller.CODE)

module.exports = router