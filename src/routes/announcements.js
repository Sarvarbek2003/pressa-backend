const controller = require('../controllers/announcements.js')
const token = require('../middlewares/token.js')
const router = require('express').Router()

router.get('/', controller.GET)
router.get('/:postId', controller.GET)

module.exports = router