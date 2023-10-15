const mongoose = require('mongoose')

const otpSchema = mongoose.Schema({
    otp: "string",
    
})

module.exports = otpSchema