const mongoose = require('mongoose');

const adminSchema = mongoose.Schema({
    adminGmail:{
        type:String,
        required:true
    },
    adminPassword:{
        type:String,
        required:true
    }
})
const adminModel = mongoose.model("admin",adminSchema)
module.exports=adminModel;