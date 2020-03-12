const focusModel = require("../model/focusModel")
const path = require('path')
const tools = require('../utils/Tools')

class Focus{
    async findAll_Paging(ctx,next){
        const total = await focusModel.find({}).count()
        const { page, size } = ctx.request.query 
        const curpage = page || 1
        const len = size || 5
        const sum = Math.ceil(total / len)
        const list = await focusModel.find({}, {}, {
            skip: (curpage - 1) * len,
            limit: Number.parseInt(len) 
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

    async findAll_notPaging(ctx,next){
        const list = await focusModel.find({}).sort({addTime: -1})
        ctx.body = {
            data: {
                list
            },
            code: 20000
        }
    }

    async findById(ctx,next){
        const _id = ctx.request.query.id
        const result = await focusModel.findById({ _id })
        
        ctx.body = {
            result,
            code: 20000
        }
    }

    async edit(ctx,next){     
        const { _id, review, focurl, focusImg, ...data } = ctx.request.body
        const url = focurl.indexOf('http://')>-1 ? focurl  : `http://${focurl}`
        const status = review === '审核' ? 1 : 0
        if(data.pic){
            const pciUrl = focusImg.substr(ctx.origin.length, focusImg.length)
            const oripath = path.join(__dirname,'../')
            const filepath = `${oripath}public${pciUrl}`
            await tools.removeFile(filepath)
        } else {
            data.pic = focusImg 
        } 
        const result = await focusModel.updateOne({ _id }, { 
            ...data,
            url,
            status
        })
        
        ctx.body = {
            result,
            code: 20000
        }
    }

    async remove(ctx,next){
        const { _id, pic } = ctx.request.body
        const pciUrl = pic.substr(ctx.origin.length, pic.length)
        const oripath = path.join(__dirname,'../')
        const filepath = `${oripath}public${pciUrl}`
        const delfileRes = await tools.removeFile(filepath)
        const result = await focusModel.remove({ _id })
        
        ctx.body = {
            data: {
                result,
                msg: delfileRes.msg 
            },
            code: 20000
        }
    }

    async add(ctx,next){
        const { review, focurl, ...data } = ctx.request.body
        const url = focurl.indexOf('http://')>-1 ? focurl  : `http://${focurl}`
        const status = review === '审核' ? 1 : 0      
        const focusEntity = new focusModel({ ...data, url, status })
        const result = await focusEntity.save()
        
        ctx.body = {
            result,
            code: 20000 
        }
    }
}

module.exports = new Focus()