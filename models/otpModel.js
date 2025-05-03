// const mongoose = require('mongoose')

// const otpSchema = mongoose.Schema({
//     otp: "string"
// })

// const otpModel = mongoose.model('otpModel',otpSchema)
// module.exports = otpModel
const mongoose = require('mongoose')

const modell = mongoose.Schema({
    otp:{
        type:String
    }
})

const otpModel = mongoose.model("otpModel",modell);
module.exports = otpModel