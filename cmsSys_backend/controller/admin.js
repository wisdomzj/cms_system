const adminModel = require("../model/adminModel")
const jwt = require('jsonwebtoken')
const path = require('path')

class Admin{
    async login(ctx,next){
        const admin = await adminModel.findOne(ctx.request.body)
        if(!admin) { 
            ctx.throw(401,"用户密码不正确")
        }
        const { _id, name } = admin
        const token = jwt.sign({ _id, name }, "my_token")
        
        ctx.body = {
            data:{
                token,
                msg:"success",
            },
            code: 20000
        }
    }

    async info(ctx,next){
        if(!ctx.state.user) { 
            ctx.throw(403,"用户被列入黑名单")
        }
        const { _id } = ctx.state.user
        const info = await adminModel.findById({ _id })
        
        ctx.body = {
            data:info,
            code: 20000
        }
    }

    async findAll(ctx,next){
        const list = await adminModel.find({})
        
        ctx.body = {
            data:list,
            code: 20000
        }  
    }

    async findById(ctx,next){
        const _id = ctx.params.id
        const result = await adminModel.findById({ _id })
        
        ctx.body = {
            result,
            code: 20000
        }
    }

    async remove(ctx,next){ 
        const _id = ctx.params.id
        const result = await adminModel.remove({ _id })
        
        ctx.body = {
            result,
            code: 20000
        }
    }

    async edit(ctx,next){
        const { _id, data } = ctx.request.body
        const file = ctx.request.files.avatar
        const basename = path.basename(file.path)
        const avatar =  `${ctx.origin}/upload/${basename}`
        const result = await adminModel.updateOne({ _id }, { ...data, avatar })
        
        ctx.body = {
            result,
            code: 20000
        }
    }

    async add(ctx,next){
        const data = ctx.request.body
        const file = ctx.request.files.avatar
        const basename = path.basename(file.path)
        const avatar =  `${ctx.origin}/upload/${basename}` 
        const adminEntity = new adminModel({...data, avatar})
        const result = await adminEntity.save()
        
        ctx.body = {
            result,
            code: 20000 
        }
    }
}

module.exports = new Admin()