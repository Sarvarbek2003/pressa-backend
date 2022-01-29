const controller = require('../controllers/auth.js')

const router = require('express').Router()

router.post('/login', controller.LOGIN)

module.exports = router