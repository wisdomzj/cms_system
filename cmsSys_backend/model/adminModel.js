const mongoose = require('mongoose');

let adminSchema = mongoose.Schema({
    name:{type:String},
    password:{type:String},
    loginTime:{type:Date},
    addTime:{type:Date},
    role:{type:Number},
    avatar:{type:String}
})

let adminModel = mongoose.model("admins",adminSchema,"admin");

module.exports = adminModel; 