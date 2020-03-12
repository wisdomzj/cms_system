const path = require('path')

class Upload{
    async uploadfile(ctx,next){ 
        const file = ctx.request.files.file
        const basename = path.basename(file.path)
        const imgUrl =  `${ctx.origin}/upload/${basename}`
        const filename = file.name
    
        ctx.body = {
            file: {
                imgUrl,
                filename
            },
            msg:'success',
            code: 20000
        }
    }
}

module.exports = new Upload()