const Router = require('koa-router')
const router = new Router({prefix: '/user'})
const { findAll, findAllName, findById, edit, remove, add }  = require('../controller/user')

router.get('/findAll',findAll)
router.get('/findAllName', findAllName)
router.get('/findById',findById)
router.post('/edit', edit)
router.post('/remove', remove)
router.post('/add', add)

module.exports = router