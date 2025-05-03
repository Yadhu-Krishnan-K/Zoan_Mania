const mongoose = require('mongoose')

const modell = mongoose.Schema({
    otp:{
        type:String,
    },
    expiryDate:{
        type:Date
    }
})

const otpModel = mongoose.model("otpModel",modell);
module.exports = otpModel