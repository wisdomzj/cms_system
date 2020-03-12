const userModel = require("../model/userModel")
const path = require('path')
const tools = require('../utils/Tools')

class User {
    async findAll(ctx,next){ 
        const total = await userModel.find({}).count()
        const { page, size } = ctx.request.query 
        const curpage = Number.parseInt(page,10) || 1
        const len = Number.parseInt(size,10) || 5
        const sum = Math.ceil(total / len)
        const list = await userModel.find({}, {}, {
            skip: (curpage - 1) * len,
            limit: len
        }).sort({addTime: -1}) 
        
        ctx.body = {
            data: {
                total,
                curpage,
                len,
                sum,
                list
            },
            code: 20000
        }
    }

    async findAllName(ctx,next){ 
        const list = await userModel.find({}) 
        const result = list.map((item)=>{
            return {
                _id: item._id,
                name: item.name
            }
        })     
        ctx.body = {
            data:{
                result
            },
            code: 20000
        }
    }

    async findById(ctx,next){
        const _id = ctx.request.query.id
        const result = await userModel.findById({ _id })
        
        ctx.body = {
            data:{
                result
            },
            code: 20000
        }
    }

    async edit(ctx,next){
        const { _id, oldavatar, oldpassword , ...data } = ctx.request.body 
        const password = !data.password ? oldpassword : data.password
        const avatar = !data.avatar ? oldavatar : data.avatar
        const info = {name: data.name,password,avatar}
        const result = await userModel.updateOne({ _id }, { $set: { ...info }})
        
        if(data.avatar){
            const avaUrl = oldavatar.substr(ctx.origin.length,oldavatar.length)
            const oripath = path.join(__dirname,'../')
            const filepath = `${oripath}public${avaUrl}`
            await tools.removeFile(filepath)
        }
    
        ctx.body = {
            data:{
                result
            },
            code: 20000
        }
    }

    async remove(ctx,next){
        const { _id, avatar } = ctx.request.body
        const avaUrl = avatar.substr(ctx.origin.length,avatar.length)
        const oripath = path.join(__dirname,'../')
        const filepath = `${oripath}public${avaUrl}`
        const delfileRes = await tools.removeFile(filepath)
        const result = await userModel.remove({ _id }) 
        ctx.body = {
            data:{
                result,
                msg: delfileRes.msg  
            },
            code: 20000
        }
    }

    async add(ctx,next){
        const data = ctx.request.body  
        const userEntity = new userModel({ ...data })
        const result = await userEntity.save()   
    
        ctx.body = {
            data:{
                result
            },
            code: 20000 
        }
    }
}

module.exports = new User()