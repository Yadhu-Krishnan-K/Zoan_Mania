require('dotenv').config()
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')
const mongoose  = require('mongoose')
const moment = require('moment')


const us = require('../controllers/UserControll/user-side')
const orderModel = require('../models/order')
const userModel = require('../models/user')
const authGuard = require('../middlewares/user-Auth')
const controller = require('../util/for-otp')
const products = require('../models/products')
const productList = require('../models/products')
const Fotp = require('../util/forgotPassword')
const userAccess = require('../middlewares/userSession')
const cartModel = require('../models/cartModel')
const pValidator = require('../util/passwordValidator')
const cart = require('../models/cartModel')
const razor = require('../middlewares/razorpay')
const coupon = require('../models/coupons')
const cartHelper = require('../helpers/cartHelper')
const Categories = require('../models/category')
const orderControll = require('../controllers/UserControll/orderControll')
const couponControll = require('../controllers/UserControll/userCouponControll')
const invoice = require('../util/invoice')
const cartCount  =require('../helpers/cartHelper')








router.get('/',authGuard.userLoggedinAuthGuard,async(req,res)=>{
    const productModel = await products.find().sort({Selled: -1}).limit(8)
    res.render('user/anonymous',{productModel})
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

router.post('/forgottenOtp',us.forgotOtp)

//---------------------------------------------------------------------------------------------------------------------------------
//otpGenerate
router.get('/forgotPasswordOtpGenerate',Fotp.Otp)

//========--------------------------------------------------------------------------------------------------------------------------------------
//otpForm
router.get('/updatePassword-1',authGuard.userLoggedinAuthGuard,us.passwordChange)

router.post('/FotpSmt',us.PassChecker)

//------password confirm
router.get('/pwConfirm',authGuard.userLoggedinAuthGuard,(req,res)=>{
    res.render('user/ConfirmPassword',{title:"Confirm Password"});
})

router.post('/confirmation-pass',us.getConfirmPass)
//===================================================================================================================
//resend otp
router.get('/resendOtp',us.pwSendOtp)

//==================================================================================================================================
//===========================================================================================================================
//add to cart
router.get('/addToCart/:id',us.userAddtoCart);

//============================================
//user cart
router.get('/cart',authGuard.userLoginAuthGuard,userAccess,us.userGetCart)

//cart quandity updation
router.post('/updateCartValue',us.cartQuantityUpdate)

//cart item deletion
router.put('/deleteCartItem/:cartId',us.cartItemDeletion)

//=============================================================================================================
//user profile========================================
router.get('/profile',authGuard.userLoginAuthGuard,userAccess,us.getUserProfile)

//user profile update=================================
router.put('/updateInfo',us.updateUserProfile)

//=============================================================================================
//password change
router.get('/changePassword',authGuard.userLoginAuthGuard,userAccess,us.passChange)

//password Check
router.post('/checkPasswords',us.passwordChange2)


//Manage  Address
router.get('/manageAddress',authGuard.userLoginAuthGuard,userAccess,us.renderManageAddress)


//user Address add
router.post('/saveAddress',us.addAddress)

// customer update address===============
router.post('/updateAddress/:userId',us.updateAddress)

//delete address
router.get('/deleteAddress/:userId/:addresId',us.deleteAddress)

//=====================================================================================================================================================
//====================================================
//user checkout
router.get('/buyTheProducts',authGuard.userLoginAuthGuard,userAccess,us.checkoutUser)


//order confirmation page======================================================
router.post('/placeOrder',orderControll.postPlaceOrder)


router.post('/verify-payment',orderControll.verifyPayment)  


router.get('/placeOrder',authGuard.userLoginAuthGuard,userAccess,orderControll.getPlaceOrder)




router.get('/orderDetails',authGuard.userLoginAuthGuard,userAccess,orderControll.orderDetail)


//cancel order
router.get('/cancelOrderData/:orderId',orderControll.cancelOrder)



//order products view
router.get('/orderProductView/:orderId',authGuard.userLoginAuthGuard,userAccess,orderControll.getOrderProductView)



//order return
router.post('/returnedItem',orderControll.returnedItem)


//coupons
//get
router.get('/manageCoupons',authGuard.userLoginAuthGuard,userAccess,couponControll.manageCoupons)

//apply coupons
router.post('/applyCoupon',couponControll.applyCoupon)


//product search000

router.post('/search',authGuard.userLoginAuthGuard,userAccess,us.searchOptions)
router.post('/filter',authGuard.userLoginAuthGuard,userAccess,us.filter)

router.get('/downloadInvoice/:orderId',invoice)


//user Wallet

router.get('/walletHistory', authGuard.userLoginAuthGuard,userAccess,(req,res)=>{
    try {
        const cartcount = cartCount
        const name = req.session.name
        res.render('user/walletHistory',{title:'WalletHistory',cartcount,name})
    } catch (error) {
        console.log('500 error')
    }
})




module.exports = router