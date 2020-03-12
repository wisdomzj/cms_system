const Koa = require('koa')
const cors = require('koa2-cors')
const koabody = require('koa-body')
const koajwt = require('koa-jwt')
const parameter = require('koa-parameter')
const error = require('koa-json-error')
const static = require('koa-static')
const mongoose = require('mongoose')
const { dbUrl } = require('./cmsSys.config')
const routing = require('./router')
const path = require('path')
const app = new Koa()
const ENV = 'test-iougz'

// 数据库链接
mongoose.connect(dbUrl,{
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true
})

mongoose.connection.on("error", (err) => {
	console.log("数据库连接失败：" + err)
})

mongoose.connection.on("open", () => {
	console.log("------数据库连接成功！------")
})

// 静态资源
app.use(static(path.join(__dirname,"./public")))

// 统一捕获错误
app.use(error({
    postFormat: (e, {stack, ...rest}) => process.env.NODE_ENV === 'production' ? rest :  {stack, ...rest}
}))

// 验证token
// app.use(koajwt({
// 	secret: 'my_token'
// }).unless({
// 	path: [/\/admin\/login/]
// }))

// 跨域
app.use(cors({
    origin: ['http://localhost:9528'],
    credentials: true
}))

// 校验参数
app.use(parameter(app))

// 接受参数
app.use(koabody({
    multipart:true,
    formidable:{
        uploadDir:path.join(__dirname,'/public/upload'),
        keepExtensions:true
    }
}))

app.use(async (ctx, next)=>{
    ctx.state.env = ENV
    await next()
})

routing(app)

app.listen(3000, ()=>{
    console.log("服务启动成功 端口号：3000")
})