const mongoose = require('mongoose')
const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')
const moment = require('moment')
const bcrypt = require('bcrypt')
const orderModel = require('../../models/order')
// const { password } = require('../../util/passwordValidator')
//c//onst products = require('../../models/products')
const OtpModel = require('../../models/otpModel')
const saltRounds = 10
const Fotp = require('../../util/forgotPassword')
const pValidator = require('../../util/passwordValidator')
const User = require('../../models/user')
// const productInHome = require('./home-page-products')
const products = require('../../models/products')
const cartModel = require('../../models/cartModel')
const category = require('../../models/category')
const controller = require('../../util/for-otp')
const { otp } = require('../../util/mailer')
const otpModel = require('../../models/otpModel')
   





//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//entering home--------------------
//////////////////////////////////////////////////////////////////////////////////////////////////////////














//forgot pass render====================
const forgotPass = (req, res) => {
  res.render('user/forgotten_pass', { title: 'forgotten password' })
}





//forgot otp
const forgotOtp = async (req, res) => {
  const email = req.body.email
  const user = await User.findOne({ email: email })
  req.session.email = email

  if (user == null) {
    res.render('user/forgotten_pass', { title: 'forgotten password', err: 'user does not exist' })
  } else {
    res.redirect('/forgotPasswordOtpGenerate')
  }

  console.log(user);
}


//confirmation password render

const getConfirmPass = async (req, res) => {
  const data = await User.findOne({ email: req.session.email })
  const hashPass = await bcrypt.hash(req.body.password, 10)
  await User.updateOne({ email: req.session.email }, { password: hashPass })
  res.redirect('\login')
}






//get Password Change
const passChange = async (req, res) => {
  const name = req.session.name
  const userId = req.session.userId
  const cartData = await cartModel.findOne({ userId: userId })
  let cartcount = 0
  if (cartData === null || cartData.Items == (null || 0)) {

    cartcount = 0

  } else {
    cartData.Items.forEach((cart) => {
      cartcount += cart.Quantity

    })
  }
  res.render('user/userPasswordChenge', { title: "Zoan | Change Password", name, cartcount })
}


//otp-section for password change 
const passwordChange = (req, res) => {
  console.log(Fotp.vaOtp)
  res.render('user/otpFormForPC')
}

//otp password check
const PassChecker = async (req, res) => {
  let n1 = req.body.n1
  let n2 = req.body.n2
  let n3 = req.body.n3
  let n4 = req.body.n4
  let val = n1 * 1000 + n2 * 100 + n3 * 10 + n4 * 1
  console.log(val)
  const otp = Fotp.vaOtp
  if (otp == val) {
    res.redirect('/pwConfirm')
  } else {
    res.send('401 Unauthorised')
  }
  // console.log(otp)
}


//password change otp send
const pwSendOtp = async (req, res) => {

  const reOtp = otpGenerator.generate(4, { digits: true, specialChars: false, lowerCaseAlphabets: false, upperCaseAlphabets: false })
  req.session.Pw = reOtp
  console.log(reOtp)
  const password = req.session.password
  const email = req.session.email

  // const datas = await User.findOne({email:email})
  const name = req.session.name;

  //    console.log(name)
  //     console.log(email)
  const data = { name, email, password }

  req.session.data = data
  //   const exist = await user.findOne({email})

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
      name: "ZoanMania",
      link: 'https://mailgen.js/'
    }
  })
  let response = {
    body: {
      name: name,
      intro: `Welcome back to ZOAN MANiA
           Password to enter Zoan_mania  "${reOtp}"`,
      outro: "Looking forward to do more business"
    }

  }
  let mail = MailGenerator.generate(response)
  let message = {
    from: process.env.email,
    to: email,
    subject: 'OTP VARIFICATION',
    html: mail
  }


  transporter.sendMail(message).then(() => {
    return res.status(201).json({
      msg: "you should receive an email"
    })
  }).catch(error => {
    return res.status(500)
  })

  res.redirect('/otpsen')

}


//password change
const passwordChange2 = async (req, res) => {
  console.log("inside check password")
  // checking validator
  const user = await User.findOne({ _id: req.session.userId })
  const Pass = req.body.Pass
  const oldPass = req.body.oldPass
  bcrypt.compare(oldPass, user.password, (err, res) => {
    if (err) {
      res.json({
        success: false,
        notfound: true
      })
    }
  })

  const errors = pValidator.validate(Pass, { details: true })

  console.log("errors====", errors);
  if (errors.length === 0) {
    const hashPass = await bcrypt.hash(Pass, 10)
    // res.status(200).json({ message: "Password is valid." });
    await User.updateOne({ _id: req.session.userId }, { $set: { password: hashPass } })
    res.json({
      success: true
    })
  }
  else {
    // Map error codes to user-friendly error messages
    const errorMessage = errors[0].message

    console.log("error:===", errorMessage);
    resjson({
      success: false,
      errors: errorMessage
    });
  }


  // console.log("ar.length===",ar.length);
}




//==============================================================================-----------------------------------------------------


module.exports = {
  forgotPass,
  forgotOtp,
  getConfirmPass,
  passChange,
  passwordChange,
  PassChecker,
  pwSendOtp,
  passwordChange2
}