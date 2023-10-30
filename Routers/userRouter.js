const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')
const mongoose  = require('mongoose')
const us = require('../controllers/UserControll/user-side')
const userModel = require('../models/user')
const authGuard = require('../middlewares/authGuard')
const productInHome = require('../controllers/UserControll/home-page-products')
const controller = require('../util/for-otp')
const products = require('../models/products')
const Fotp = require('../util/forgotPassword')
const userAccess = require('../middlewares/userSession')
const cartModel = require('../models/cartModel')
const pValidator = require('../util/passwordValidator')


router.get('/',authGuard.userLoggedinAuthGuard,(req,res)=>{

    res.render('user/anonymous',{productInHome})
})


//user login-------------------------------------------------------------------------
router.get('/login',authGuard.userLoggedinAuthGuard,us.userLogin);

//user signup----------------------------------------------------------------------------------
router.get('/signup',authGuard.userLoggedinAuthGuard,us.userSignup)

//--------------------------------------------------------------------------------------------------------------------------//
//userHome


router.get('/userHome',authGuard.userLoginAuthGuard,userAccess,us.getHome)

//-------------------------------------------------------------------------------------------------------------------------------------------
//otp control---------------------------------------------------------

router.post('/otpsend',controller.otp);

//=----------==-----------------------=-------------------------------------=--------------------------------------------------------------------
//otp form--------

router.get('/otpsen',authGuard.userLoggedinAuthGuard,us.otpForm)
 
//--------------------------------------------------------------------------------------------------
//entering to home route --------------------===------------------=--------

router.post('/home',us.postEnteringHOme)

//====-----------------------------------------------------------------------------------------------------

//userloginbackend==---------------------------------------------------------------//-----------------------------------------------------------

router.post('/homed',us.userLoginBackend)

//----------------------------------------------------------------------------------------------------------------------------------------------------//
//logout




router.get('/logout',us.logout)
    
// res.redirect('/');

//--------------------------------------------------------------------------------------------------------------------------------------------------------------//
//product-list userside---------------------------------------------------------------------------------

router.get('/Product-list',authGuard.userLoginAuthGuard, userAccess, us.productList1)
//------------------------------------------------------------------------------------------------------------------------------------------



//============================================================================================================================================

//product detail page

router.route('/productDetail/:id',authGuard.userLoginAuthGuard,userAccess)
.get(us.producDetail)
//------------------------------------------------------------------------------------------------------------------------
  
  
    //user forgot password
router.route('/forgotPassword',authGuard.userLoggedinAuthGuard)
    .get(us.forgotPass)
    //forgotten otp================
    
router.post('/forgottenOtp',us.forgotOtp)

//---------------------------------------------------------------------------------------------------------------------------------
//otpGenerate
router.get('/forgotPasswordOtpGenerate',Fotp.Otp)

//otpForm
router.get('/updatePassword-1',(req,res)=>{
    console.log(Fotp.vaOtp)
    res.render('user/otpFormForPC')
})

router.post('/FotpSmt',async(req,res)=>{
    let n1 = req.body.n1
    let n2 = req.body.n2
    let n3 = req.body.n3
    let n4 = req.body.n4
    let val = n1*1000+n2*100+n3*10+n4*1
    console.log(val)
    const otp = Fotp.vaOtp
    if(otp==val){
        res.redirect('/pwConfirm')
    }else{
        res.send('401 Unauthorised')
    }
    // console.log(otp)
    
})

//------password confirm
router.get('/pwConfirm',(req,res)=>{
    res.render('user/ConfirmPassword',{title:"Confirm Password"});
})

router.post('/confirmation-pass',us.getConfirmPass)
//===================================================================================================================
//resend otp
router.get('/resendOtp',async(req,res)=>{

const reOtp=otpGenerator.generate(4, { digits: true, specialChars: false, lowerCaseAlphabets: false, upperCaseAlphabets: false })
req.session.Pw = reOtp
console.log(reOtp)
const password = req.session.password
const email = req.session.email

// const datas = await userModel.findOne({email:email})
const name = req.session.name;

//    console.log(name)
//     console.log(email)
const data = {name,email,password}

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
         Password to enter Zoan_mania  "${reOtp}"`,
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

})

//==================================================================================================================================
//===========================================================================================================================
//add to cart
router.get('/addToCart/:id',us.userAddtoCart);










//============================================
//user cart

router.get('/cart',authGuard.userLoginAuthGuard,us.userGetCart)
//====================================================
//=========================================================
//cart quandity updation

  router.post('/updateCartValue',us.cartQuantityUpdate)


//cart item deletion


router.put('/deleteCartItem/:cartId',us.cartItemDeletion)







//=============================================================================================================
//user profile========================================

router.get('/profile',us.getUserProfile)


//user profile update=================================

router.post('/updateInfo',us.updateUserProfile)
//=============================================================================================
//password change
router.get('/changePassword',us.passChange)





//password Check
router.post('/checkPasswords',async(req,res)=>{
// try {
  
// } catch (error) {
  
// }
console.log("inside check password")

// checking validator
  const Pass = req.body.Pass
  // const ar = []
  // console.log("pass===",Pass);
  //password validator
  const errors = pValidator.validate(Pass,{details:true})

console.log("errors====",errors);
  if (errors.length === 0) {
    const hashPass = await bcrypt.hash(Pass,10)
    // res.status(200).json({ message: "Password is valid." });
    await userModel.updateOne({_id:req.session.userId},{$set:{password:Pass}})
    res.json({
      success:true

      })

  }
  else {
    // Map error codes to user-friendly error messages
    const errorMessage = errors[0].message
   
    console.log("error:===",errorMessage);
    res.status(400 ).json({ 
      errors: errorMessage
     });
  }


  // console.log("ar.length===",ar.length);
  
  
})






























module.exports = router 