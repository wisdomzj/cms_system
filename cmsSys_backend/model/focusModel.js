const mongoose = require("mongoose");

let focusSchema = mongoose.Schema({
    title:{type:String},
    url:{type:String},
    addTime:{type:Date},
    status:{type:Number},
    pic:{type:String},    
})

let focusModel = mongoose.model("focuss",focusSchema,"focus");

module.exports = focusModel;