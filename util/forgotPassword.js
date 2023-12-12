require('dotenv').config()
const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')
const user = require('../models/user')



//otp generator
const otpGenerator = require('otp-generator')

var vaOtp=otpGenerator.generate(4, { digits: true, specialChars: false, lowerCaseAlphabets: false, upperCaseAlphabets: false })

// console.log(vaotp)
// sent mail with real email account

// router.get('/forgotPasswordOtpGenerate',(req,res)=>{
    

 const Otp = async(req,res)=>{

  
   const email = req.session.email
   const datas = await user.findOne({email:email})
   const name = datas.name
//    console.log(name)
//     console.log(email)
  const data = email
  
  req.session.data = data
//   const exist = await user.findOne({email})
      
        let config = {
          service : 'gmail',
          auth : {
            user:process.env.EMAIL,
            pass:process.env.PASSWORD
          }
        }
        
        let transporter = nodemailer.createTransport(config)
  
        let MailGenerator =new Mailgen({
          theme:"default",
          product:{
            name:"ZoanMania",
            link:'https://mailgen.js/'
          }
        })
        let response = {
          body:{
            name:name,
            intro:`Welcome back to ZOAN MANiA
            Your otp to reset password is "${vaOtp}"`,
            outro:"Looking forward to do more business"
          }
  
        }
        let mail =MailGenerator.generate(response)
        let message = {
          from:process.env.email,
          to:email,
          subject:'OTP VARIFICATION',
          html:mail
        }
  
        
        transporter.sendMail(message).then(()=>{
          return res.status(201).json({
            msg:"you should receive an email"
          })
        }).catch(error => {
          return res.status(500)
        })
  
      res.redirect('/updatePassword-1')
    }
    //   }else{
        
    //     // res.render('user/userSignUp',{title: "SignUp",exist:"The user already exists"})
    //   }
  

  





 
    // res.status(201).json("getBill Successfully....!")


module.exports = {Otp,vaOtp}