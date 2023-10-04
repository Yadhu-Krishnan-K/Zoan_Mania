const mongoose = require('mongoose')

const sch = mongoose.Schema({
    catName:{
        type:String
        // required:true
    }
})
const monmodel = mongoose.model("user",sch);

module.exports = monmodel