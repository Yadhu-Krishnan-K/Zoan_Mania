const express = require('express')
const router = express.Router()



const us = require('../controllers/user-side')
const userModel = require('../models/user')
const authGuard = require('../middlewares/authGuard')
const productInHome = require('../controllers/home-page-products')
const controller = require('../controllers/for-otp')
const productList = require('../models/products')





//user login-------------------------------------------------------------------------
router.get('/',us.userLogin);

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

//user forgot password
router.route('/forgotPassword')
    .get((req,res)=>{
        res.render('user/forgotten_pass',{title:'forgotten password'})
      })



//============================================================================================================================================

//product detail page

router.route('/productDetail/:id')
      .get(async(req,res)=>{
        const name = req.session.name
        const P_id = req.params.id
        const P_detail = await productList.find({P_id})
        console.log(P_id)
        
        res.render('user/product -page',{name,title: 'Product Page'})


      })





module.exports = router