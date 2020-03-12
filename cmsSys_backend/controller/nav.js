const navModel = require("../model/navModel")

class Nav{
    async findAll_Paging(ctx,next){ 
        const total = await navModel.find({}).count()
        const { page, size } = ctx.request.query 
        const curpage = Number.parseInt(page,10) || 1
        const len = Number.parseInt(size,10) || 5
        const sum = Math.ceil(total / len)
        const list = await navModel.find({}, {}, {
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
        const list = await navModel.find({}).sort({addTime: -1})
        ctx.body = {
            data: {
                list
            },
            code: 20000
        }
    }

    async findById(ctx,next){
        const _id = ctx.request.query.id
        const result = await navModel.findById({ _id })
        
        ctx.body = {
            result,
            code: 20000
        }
    }

    async edit(ctx,next){ 
        const { _id, review, navurl, ...data } = ctx.request.body
        const url = navurl.indexOf('http://')>-1 ? navurl  : `http://${navurl}`
        const status = review === '审核' ? 1 : 0
        const result = await navModel.updateOne({ _id }, { ...data, url, status })
        
        ctx.body = {
            result,
            code: 20000
        }
    }

    async remove(ctx,next){
        const _id = ctx.request.query.id
        const result = await navModel.remove({ _id })
        
        ctx.body = {
            result,
            code: 20000
        }
    }

    async add(ctx,next){
        const { review, navurl, ...data } = ctx.request.body
        const url = navurl.indexOf('http://')>-1 ? navurl  : `http://${navurl}`
        const status = review === '审核' ? 1 : 0  
        const navEntity = new navModel({...data, url, status})
        const result = await navEntity.save()
        
        ctx.body = {
            result,
            code: 20000 
        }
    }
}

module.exports = new Nav()