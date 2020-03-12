const Router = require('koa-router')
const router = new Router({prefix: '/admin'})
const { login, info, findAll, findById, remove, edit, add } = require('../controller/admin')

router.post('/login', login)
router.get("/info", info)
router.get('/findAll', findAll)
router.get('/findById/:id', findById)
router.get('/remove/:id', remove)
router.post('/edit', edit)
router.post('/add', add)

module.exports = router