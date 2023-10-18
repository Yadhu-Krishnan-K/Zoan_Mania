const express = require('express')
const router = express.Router()


const bcrypt = require('bcrypt')
const us = require('../controllers/user-side')
const userModel = require('../models/user')
const authGuard = require('../middlewares/authGuard')
const productInHome = require('../controllers/home-page-products')
const controller = require('../controllers/for-otp')
const productList = require('../models/products')
const Fotp = require('../controllers/forgotPassword')


router.get('/',(req,res)=>{

    res.render('user/anonymous',{productInHome})
})


//user login-------------------------------------------------------------------------
router.get('/login',us.userLogin);

//user signup----------------------------------------------------------------------------------
router.get('/signup',us.userSignup)

//--------------------------------------------------------------------------------------------------------------------------//
//userHome


router.get('/userHome',authGuard,us.getHome)

//-----------------------------------------------------------------------------------------
//checking for already existing user while registering
// router.post ('/checkUser',(req,res)=>{



//     res.redirect('/otpsend')
// })
//--------------------------------------------------------------------------------------------------------------
//otp control------------------------------------------------

router.post('/otpsend',controller.otp);

//=----------==-----------------------=-------------------------------------=---------------
//otp form--------

router.get('/otpsen',us.otpForm)
 
//--------------------------------------------------------------------------------------------------
//entering to home route --------------------===------------------=--------

router.post('/home',us.postEnteringHOme)

//====-----------------------------------------------------------------------------------------------------

//userloginbackend==---------------------------------------------------------------//-----------------------------------------------------------

router.post('/homed',us.userLoginBackend)

//----------------------------------------------------------------------------------------------------------------------------------------------------//
//logout




router.get('/logout',(req,res)=>{
    
    req.session.destroy((err)=>{
        if (err) {
            console.log(err)
        } else {
            res.setHeader('Cache-Control','no-store')
            res.redirect('/')
        }
    })
    
})
// res.redirect('/');

//--------------------------------------------------------------------------------------------------------------------------------------------------------------//
//product-list userside---------------------------------------------------------------------------------

router.get('/Product-list',async(req,res)=>{
    const products = await productList.find();
    const name = req.session.name

    res.render('user/product-list',{name,products});
})
//------------------------------------------------------------------------------------------------------------------------------------------



//============================================================================================================================================

//product detail page

router.route('/productDetail/:id')
.get(async(req,res)=>{
        const name = req.session.name
        const P_id = req.params.id
        console.log("Product id=",P_id)
        const P_detail = await productList.findOne({_id: P_id})
        console.log(P_detail)


        
        res.render('user/product -page',{P_detail,name,title: 'Product Page'})
        
        
    })
//------------------------------------------------------------------------------------------------------------------------
  
  
    //user forgot password
router.route('/forgotPassword')
    .get((req,res)=>{
        res.render('user/forgotten_pass',{title:'forgotten password'})
    })
    //forgotten otp================
    
router.post('/forgottenOtp',async(req,res)=>{
    const email = req.body.email
    const user = await userModel.findOne({email: email})
    req.session.email=email
    if(user==null){
        res.render('user/forgotten_pass',{title:'forgotten password',err:'user does not exist'})
    }else{
        res.redirect('/forgotPasswordOtpGenerate')
    }
    
    console.log(user);
})

//---------------------------------------------------------------------------------------------------------------------------------
//otpGenerate
router.get('/forgotPasswordOtpGenerate',Fotp.Otp)

//otpForm
router.get('/updatePassword-1',(req,res)=>{

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

router.post('/confirmation-pass',async(req,res)=>{
// console.log("your email is = ",req.session.email)
const data = await userModel.findOne({email: req.session.email})
const hashPass = await bcrypt.hash(req.body.password,10)
await userModel.updateOne({email: req.session.email},{password: hashPass})
res.redirect('\login')
})






















module.exports = router