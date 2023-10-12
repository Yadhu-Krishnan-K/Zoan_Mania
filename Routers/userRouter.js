const express = require('express')
const router = express.Router()
 


const us = require('../controllers/user-side')
const userModel = require('../models/user')
const authGuard = require('../middlewares/authGuard')
const productInHome = require('../controllers/home-page-products')
const controller = require('../controllers/for-otp')





//user login-------------------------------------------------------------------------
router.get('/',us.userLogin);

//user signup----------------------------------------------------------------------------------
router.get('/signup',us.userSignup)

//--------------------------------------------------------------------------------------------------------------------------//
//userHome


router.get('/userHome',authGuard,us.getHome)

//-----------------------------------------------------------------------------------------
//otp control------------------------------------------------

router.post('/otpsend',controller.otp);

//=----------==-----------------------=-------------------------------------=---------------
//otp form--------

router.get('/otpsen',us.otpForm)
 
//--------------------------------------------------------------------------------------------------
//entering to home route --------------------===------------------=--------

router.post('/home',us.postEnteringHOme)

//====-----------------------------------------------------------------------------------------------------

//userloginbackend==----------------------------------------------------------------------------------

router.post('/homed',us.userLoginBackend)

//------------------------------------------------------------------------------------------//
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






module.exports = router