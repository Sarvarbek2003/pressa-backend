const controller = require('../controllers/announcements.js')
const token = require('../middlewares/token.js')
const router = require('express').Router()

router.get('/',token, controller.GET)
router.get('/:postId', controller.GET)

module.exports = router