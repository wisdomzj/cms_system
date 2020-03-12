const mongoose = require("mongoose");

let settingSchema = mongoose.Schema({
    websiteName:{type:String},
    logo:{type:String},
    keywords:{type:String},
    description:{type:String},
    recordNumber:{type:String},
    customer_qq:{type:String},
    customer_telephone:{type:String},
    setTime:{type:Date}    
})

let settingModel = mongoose.model("settings",settingSchema,"setting");

module.exports = settingModel;