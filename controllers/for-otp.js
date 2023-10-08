require('dotenv').config()
const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')
const monmodel= require('../models/user')


//otp generator
const otpGenerator = require('otp-generator')

var vaotp=otpGenerator.generate(4, { digits: true, specialChars: false, lowerCaseAlphabets: false, upperCaseAlphabets: false })

// console.log(vaotp)
// sent mail with real email account

 const otp = async(req,res)=>{

   
  const {name,email,password}=req.body;
  const logged=await monmodel.create({name,email,password});
  if (logged) {
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
          name:"Mailgen",
          link:'https://mailgen.js/'
        }
      })
      let response = {
        body:{
          name:name,
          intro:`YOUR OTP FOR ZOAN MANiA ${vaotp}`,
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

    res.redirect('/otpsen')
  

  }else{
      console.log("something went wrong");
  }


}

 
    // res.status(201).json("getBill Successfully....!")


module.exports = {otp,vaotp,}