const articleModel = require("../model/articleModel")
const userModel = require("../model/userModel")
const path = require('path')
const tools = require('../utils/Tools')

class Article {
    async findAll(ctx,next){
        const total = await articleModel.find({}).count()
        const { page, size } = ctx.request.query 
        const curpage = Number.parseInt(page) || 1
        const len = Number.parseInt(size) || 5
        const sum = Math.ceil(total / len)
        const list1 = await articleModel.find({}, {}, {
            skip: (curpage - 1) * len,
            limit: len
        }).sort({
            addTime: -1
        }).populate('uid')
        
        const list2 = await articleModel.aggregate([
            { "$addFields": { "_id": { "$toString": "$_id" }}},
            { "$lookup": {
                "from": "users",
                "localField": "uid",
                "foreignField": "_id",
                "as": "author"
            }},
            { $skip:(curpage - 1) * len },
            { $limit:len }
        ])
    
        const list3 = await userModel.aggregate([
            { "$addFields": { "_id": { "$toString": "$_id" }}},
            { "$lookup": {
                "from": "article",
                "localField": "_id",
                "foreignField": "uid",
                "as": "arts"
            }},
            { $skip:(curpage - 1) * len },
            { $limit:len }
        ])
        
        ctx.body = {
            data: {
                total,
                curpage,
                len,
                sum,
                list1
            },
            code: 20000
        }
    }

    async findById(ctx,next){
        const _id = ctx.request.query.id
        const result = await articleModel.findById({ _id }).populate('uid')
        
        ctx.body = {
            result,
            code: 20000
        }
    }

    async remove(ctx,next){
        const { _id, imgUrl } = ctx.request.body
        const pciUrl = imgUrl.substr(ctx.origin.length, imgUrl.length)
        const oripath = path.join(__dirname,'../')
        const filepath = `${oripath}public${pciUrl}`
        const delfileRes = await tools.removeFile(filepath)
        const result = await articleModel.remove({ _id })
        
        ctx.body = {
            data: {
                result,
                msg: delfileRes.msg 
            },
            code: 20000
        }
    }

    async edit(ctx,next){ 
        const { _id, type, review, coverPicture, ...data } = ctx.request.body
        const recommend = {
            is_best: type.indexOf('精文')>-1 ? 1 : 0,
            is_hot: type.indexOf('热文')>-1 ? 1 : 0,
            is_new: type.indexOf('新文')>-1 ? 1 : 0,
            status: review === '审核' ? 1 : 0      
        }    
        if(data.imgUrl){
            const imgUrl = coverPicture.substr(ctx.origin.length,coverPicture.length)
            const oripath = path.join(__dirname,'../')
            const filepath = `${oripath}public${imgUrl}`
            await tools.removeFile(filepath)
        } else {
            data.imgUrl = coverPicture 
        } 
        const result = await articleModel.updateOne({ _id }, { ...data, ...recommend })
        
        ctx.body = {
            result,
            code: 20000
        }
    }

    async add(ctx,next){
        const { type, review, ...data } = ctx.request.body
        const recommend = {
            is_best: type.indexOf('精文')>-1 ? 1 : 0,
            is_hot: type.indexOf('热文')>-1 ? 1 : 0,
            is_new: type.indexOf('新文')>-1 ? 1 : 0,
            status: review === '审核' ? 1 : 0      
        }    
        const articleEntity = new articleModel({ ...data, ...recommend })
        const result = await articleEntity.save()
        
        ctx.body = {
            result,
            code: 20000 
        }
    }
}

module.exports = new Article()