require('dotenv').config()
const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')
const user = require('../models/user')
//otp generator
const otpGenerator = require('otp-generator')





const vaotp= () => { var vtp = otpGenerator.generate(4,
  {
  digits: true,
  specialChars: false, 
  lowerCaseAlphabets: false, 
  upperCaseAlphabets: false 
  })
  console.log(vtp)
  return vtp
}
// sent mail with real email account


 const  otp = async(req,res)=>{

  try {
    const test = 24
     
    const {name,email,password}=req.body;
    const data = {name,email,password}
    req.session.email = email;
    req.session.password = password;
    req.session.name = name;
    const uname = await user.findOne({name: name})
    if(uname){
      // res.render('user/userSignUp',{title: "SignUp",exist:"The username already exists"})
      req.session.exist = "The username already exists"
      res.redirect('/signup')
  
    }
  
  
    req.session.data = data
    const exist = await user.findOne({email})
        if(!exist){
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
              intro:`YOUR OTP FOR ZOAN MANiA ${vaotp()}`,
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
            return res.redirect('/otpsen')
          }).catch(error => {
            return res.status(500)
          })
          
        
        }else{
          
          res.render('user/userSignUp',{title: "SignUp",exist:"The email already exists"})
        }
    
  } catch (error) {
    console.log('500 error',error)
  }

  }





 
    // res.status(201).json("getBill Successfully....!")


module.exports = {otp,vaotp}