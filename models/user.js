const mongoose = require('mongoose')

const sch = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
   
    email:{
        type:String,
        unique:true,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})
const monmodel = mongoose.model("user",sch);

module.exports = monmodel