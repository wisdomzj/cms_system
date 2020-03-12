
const settingModel = require("../model/settingModel")
const path = require('path')
const tools = require('../utils/Tools')

class Setting{
    async info(ctx,next){
        const info = await settingModel.findOne({}) 
        
        ctx.body = {
            data: info,
            code: 20000
        }
    }

    async edit(ctx,next){
        const { _id, oldlogo, ...data } = ctx.request.body
        if(data.logo != oldlogo){
            const logoUrl = oldlogo.substr(ctx.origin.length, oldlogo.length)
            const oripath = path.join(__dirname,'../')
            const filepath = `${oripath}public${logoUrl}`
            await tools.removeFile(filepath)
        } 
        const result = await settingModel.updateOne({ _id }, { ...data })
        
        ctx.body = {
            result,
            code: 20000
        }
    }
}

module.exports = new Setting()