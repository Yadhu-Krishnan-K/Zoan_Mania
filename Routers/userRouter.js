require('dotenv').config()
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')
const mongoose  = require('mongoose')
const moment = require('moment')
// const Razorpay = require('razorpay')
// var instance = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// });


const us = require('../controllers/UserControll/user-side')
const orderModel = require('../models/order')
const userModel = require('../models/user')
const authGuard = require('../middlewares/user-Auth')
const productInHome = require('../controllers/UserControll/home-page-products')
const controller = require('../util/for-otp')
const products = require('../models/products')
const Fotp = require('../util/forgotPassword')
const userAccess = require('../middlewares/userSession')
const cartModel = require('../models/cartModel')
const pValidator = require('../util/passwordValidator')
const cart = require('../models/cartModel')
const { verifyUserOnOtp } = require('../middlewares/verifyUserOnOtp')
const {
    signup,
    userLogin,
    userSignup,
    otpForm,
    verifyOtp,
    logout,
    userLoginBackend
} = require("../controllers/UserControll/authControll")
const { getHome } = require('../controllers/UserControll/homeControll')
const { productList1, producDetail } = require('../controllers/UserControll/productControll')
const { userAddtoCart, userGetCart, cartQuantityUpdate, cartItemDeletion } = require('../controllers/UserControll/cartController')
const { getUserProfile, updateUserProfile } = require('../controllers/UserControll/profileControll')
const { renderManageAddress, addAddress, updateAddress, deleteAddress } = require('../controllers/UserControll/addressControll')
const { checkoutUser, renderPlaceOrder, renderOrderDetails, cancelOrderData, orderedProduct, returnedItem, placeOrder } = require('../controllers/UserControll/orderController')







//anonymous
router.get('/',authGuard.userLoggedinAuthGuard,(req,res)=>{
    res.render('user/anonymous',{productInHome})
})
 
//@authcontroll
//@signup
router.route('/signup')
.get(authGuard.userLoggedinAuthGuard,userSignup)
.post(signup)

router.route('/otp')
.get(authGuard.userLoggedinAuthGuard,verifyUserOnOtp,otpForm)
.post(verifyOtp)

router.get('/signup',authGuard.userLoggedinAuthGuard,userSignup)

//--------------------------------------------------------------------------------------------------------------------------//
//user login-------------------------------------------------------------------------
router.route('/login')
      .get(authGuard.userLoggedinAuthGuard,userLogin)
      .post(userLoginBackend)
//logout
router.get('/logout',logout)


//userHome
router.get('/userHome',authGuard.userLoginAuthGuard,userAccess,getHome)

    
//--------------------------------------------------------------------------------------------------------------------------------------------------------------//
//product-list userside---------------------------------------------------------------------------------
router.get('/Product-list',authGuard.userLoginAuthGuard, userAccess, productList1)

//------------------------------------------------------------------------------------------------------------------------------------------
//============================================================================================================================================

//product detail page
router.route('/productDetail/:id',authGuard.userLoginAuthGuard,userAccess)
.get(producDetail)

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
router.get('/addToCart/:id',userAddtoCart);

//============================================
//user cart
router.get('/cart',authGuard.userLoginAuthGuard,userAccess,userGetCart)

//cart quandity updation
router.post('/updateCartValue',cartQuantityUpdate)

//cart item deletion
router.put('/deleteCartItem/:cartId',cartItemDeletion)


// // Get all cart items OR Add a new item
// router.route('/cart')
//   .get(authGuard.userLoginAuthGuard, userAccess, getCart)   // GET /cart
//   .post(authGuard.userLoginAuthGuard, userAccess, addToCart); // POST /cart (add new item)

// // Update or Delete a specific cart item
// router.route('/cart/:id')
//   .patch(authGuard.userLoginAuthGuard, userAccess, updateCartItem) // PATCH /cart/:id (update quantity)
//   .delete(authGuard.userLoginAuthGuard, userAccess, deleteCartItem); // DELETE /cart/:id (remove item)




//=============================================================================================================
//user profile========================================
router.get('/profile',authGuard.userLoginAuthGuard,userAccess,getUserProfile)

//user profile update=================================
router.put('/updateInfo',updateUserProfile)

//=============================================================================================
//password change
router.get('/changePassword',authGuard.userLoginAuthGuard,userAccess,us.passChange)

//password Check
router.post('/checkPasswords',us.passwordChange2)


//Manage  Address
router.get('/manageAddress',authGuard.userLoginAuthGuard,userAccess,renderManageAddress)


//user Address add
router.post('/saveAddress',addAddress)

// customer update address===============
router.post('/updateAddress/:userId',updateAddress)

//delete address
router.get('/deleteAddress/:userId/:addresId',deleteAddress)

//=====================================================================================================================================================
//================================================
//user checkout
router.get('/buyTheProducts',authGuard.userLoginAuthGuard,userAccess,checkoutUser)


//order confirmation page======================================================
router.route('/placeOrder')
      .get(authGuard.userLoginAuthGuard,userAccess,renderPlaceOrder)
      .post(placeOrder)

router.get('/orderDetails',authGuard.userLoginAuthGuard,userAccess,renderOrderDetails)


//cancel order
router.get('/cancelOrderData/:orderId',cancelOrderData)



//order products view
router.get('/orderProductView/:orderId',authGuard.userLoginAuthGuard,userAccess,orderedProduct)



//order return 
router.post('/returnedItem',returnedItem)







module.exports = router 