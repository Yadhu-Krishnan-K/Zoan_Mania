const OtpModel = require('../models/otpModel')

const verifyUserOnOtp =async(req,res,next) => {
    try {
        let email = req.session.authEmail
        let otp = await OtpModel.findOne({email})
        if(otp){
            next();
        }else{
            res.redirect('/signup')
        }
        
    } catch (error) {
        console.log('error from verifyUserOnOtp = ',error.message)
    }

}

module.exports = {verifyUserOnOtp}