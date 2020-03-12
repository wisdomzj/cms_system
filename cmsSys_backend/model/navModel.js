const mongoose = require("mongoose");

let navSchema = mongoose.Schema({
    navName:{type:String},
    url:{type:String},
    addTime:{type:Date},
    status:{type:Number}    
})

let navModel = mongoose.model("navs",navSchema,"nav");

module.exports = navModel;