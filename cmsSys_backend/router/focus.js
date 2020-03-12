const Router = require('koa-router')
const router = new Router({prefix: '/focus'})
const { findAll_Paging, findAll_notPaging, findById, edit, remove,add } = require('../controller/focus')

router.get('/findAllPaging', findAll_Paging)
router.get('/findAllnotPaging', findAll_notPaging)
router.get('/findById', findById)
router.post('/edit', edit)
router.post('/remove', remove)
router.post('/add', add)

module.exports = router