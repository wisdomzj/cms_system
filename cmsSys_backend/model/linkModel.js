const mongoose = require("mongoose");

let linkSchema = mongoose.Schema({
    linkName:{type:String},
    url:{type:String},
    addTime:{type:Date},
    status:{type:Number}    
})

let linkModel = mongoose.model("links",linkSchema,"link");

module.exports = linkModel;