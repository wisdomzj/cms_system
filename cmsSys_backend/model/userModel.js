const mongoose = require('mongoose');

let userSchema = mongoose.Schema({
    name:{type:String},
    password:{type:String},
    loginTime:{type:Date},
    addTime:{type:Date},
    avatar:{type:String}
})

let userModel = mongoose.model("users",userSchema,"user");

module.exports = userModel; 