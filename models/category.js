const mongoose = require('mongoose')

const sch = mongoose.Schema({
    catName:{
        type:String,
        required:true
    },image:{
        type:String
    }
})
const monmodel = mongoose.model("Category",sch);

module.exports = monmodel