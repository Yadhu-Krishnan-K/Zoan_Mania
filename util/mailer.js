require('dotenv').config()
const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')
const User = require('../models/user')
const OtpModel = require('../models/otpModel')
const {generateOtp} = require('./otpGenerator')
const otpModel = require('../models/otpModel')

const otp = async ({ name, email, password }) => {

    try {
        //if otp already sent
        let existOtp = await otpModel.findOne({email})
        if(existOtp) return

        //if not sent
        let config = {
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        }

        let transporter = nodemailer.createTransport(config)

        let MailGenerator = new Mailgen({
            theme: "default",
            product: {
                name: "Mailgen",
                link: 'https://mailgen.js/'
            }
        })
        let otpValue = generateOtp();
        console.log('generated otp = ',otpValue)
        
        let savedOtp = await OtpModel.create({
            name,
            email,
            password,
            otp: otpValue,
        })
        await savedOtp.save()
        let response = {
            body: {
                name: name,
                intro: `YOUR OTP FOR ZOAN MANiA ${otpValue}`,
                outro: "Looking forward to do more business"
            }

        }
        let mail = MailGenerator.generate(response)
        let message = {
            from: process.env.EMAIL,
            to: email,
            subject: 'OTP VARIFICATION',
            html: mail
        }


        transporter.sendMail(message).then(() => {
            console.log('verified and sending otp...')
        }).catch(error => {
            console.log('error = ', error)
        })

    } catch (error) {
        console.error(`error occured when sending otp, the error is ${error}`)
    }
    finally{
        return
    }


}

module.exports = {
    otp
}