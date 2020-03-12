const mongoose = require('mongoose');

let articleSchema = mongoose.Schema({
    uid:{type:String,ref:"users"},
    title:{type:String},
    status:{type:Number},
    is_best:{type:Number},
    is_hot:{type:Number},
    is_new:{type:Number},
    keywords:{type:String},
    description:{type:String},
    content:{type:String},
    addTime:{type:Date}, 
    imgUrl:{type:String}
})

let articleModel = mongoose.model("articles",articleSchema,"article");

module.exports = articleModel; 