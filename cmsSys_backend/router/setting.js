const Router = require('koa-router')
const router = new Router({prefix: '/setting'})
const { info, edit } = require('../controller/setting')

router.get('/info', info)
router.post('/edit', edit)

module.exports = router