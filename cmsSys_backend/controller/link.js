const linkModel = require("../model/linkModel")

class Link{
    async findAll_Paging(ctx,next){
        const total = await linkModel.find({}).count()
        const { page, size } = ctx.request.query 
        const curpage = Number.parseInt(page) || 1
        const len = Number.parseInt(size) || 5
        const sum = Math.ceil(total / len)
        const list = await linkModel.find({}, {}, {
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

    async findAll_notPaging(ctx,next){
        const list = await linkModel.find({}).sort({addTime: -1})
        ctx.body = {
            data: {
                list
            },
            code: 20000
        }
    }

    async findById(ctx,next){
        const _id = ctx.request.query.id
        const result = await linkModel.findById({ _id })
        
        ctx.body = {
            result,
            code: 20000
        }
    }

    async edit(ctx,next){ 
        const { _id, review, linkurl, ...data } = ctx.request.body
        const url = linkurl.indexOf('http://')>-1 ? linkurl  : `http://${linkurl}` 
        const status = review === '审核' ? 1 : 0  
        const result = await linkModel.updateOne({ _id }, {...data, url, status})
        
        ctx.body = {
            result,
            code: 20000
        }
    }

    async remove(ctx,next){
        const _id = ctx.request.query.id
        const result = await linkModel.remove({ _id })
        
        ctx.body = {
            result,
            code: 20000
        }
    }

    async add(ctx,next){
        const { review,  linkurl, ...data } = ctx.request.body
        const url = linkurl.indexOf('http://')>-1 ? linkurl  : `http://${linkurl}`
        const status = review === '审核' ? 1 : 0  
        const linkEntity = new linkModel({ ...data, url, status })
        const result = await linkEntity.save()
        
        ctx.body = {
            result,
            code: 20000 
        }
    }
}

module.exports = new Link()