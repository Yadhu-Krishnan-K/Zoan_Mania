const mongoose = require('mongoose')

const modell = mongoose.Schema({
    email:{
        type: String,
        required: true,
    },
    password:{
        type:String,
        unique:true,
        required:true
    },
    otp:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        expires:300, //<-- keeps this document for 5 mins 
    }
})

const otpModel = mongoose.model("otpModel",modell);
module.exports = otpModel