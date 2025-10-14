require('dotenv').config()
const express = require('express')

const us = require('../controllers/UserControll/user-side')
const authGuard = require('../middlewares/user-Auth')
const productInHome = require('../controllers/UserControll/home-page-products')
const Fotp = require('../util/forgotPassword')
const userAccess = require('../middlewares/userSession')
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
const { checkoutUser, renderPlaceOrder, renderOrderDetails, cancelOrderData, orderedProduct, returnedItem, placeOrder, orderSuccessPage, verifyOrder } = require('../controllers/UserControll/orderController')

const router = express.Router()

// =================== Anonymous ===================
router.get('/', authGuard.userLoggedinAuthGuard, (req, res) => {
  res.render('user/anonymous', { productInHome })
})


// =================== Authentication ===================
router.route('/signup')
  .get(authGuard.userLoggedinAuthGuard, userSignup)
  .post(signup)

router.route('/otp')
  .get(authGuard.userLoggedinAuthGuard, verifyUserOnOtp, otpForm)
  .post(verifyOtp)

router.route('/login')
  .get(authGuard.userLoggedinAuthGuard, userLogin)
  .post(userLoginBackend)

router.get('/logout', logout)


// =================== Home ===================
router.get('/userHome', authGuard.userLoginAuthGuard, userAccess, getHome)


// =================== Product ===================
router.get('/Product-list', authGuard.userLoginAuthGuard, userAccess, productList1)
router.get('/productDetail/:id', authGuard.userLoginAuthGuard, userAccess, producDetail)


// =================== Forgot Password ===================
router.route('/forgotPassword')
  .get(authGuard.userLoggedinAuthGuard, us.forgotPass)

router.post('/forgottenOtp', us.forgotOtp)
router.get('/forgotPasswordOtpGenerate', Fotp.Otp)
router.get('/updatePassword-1', authGuard.userLoggedinAuthGuard, us.passwordChange)
router.post('/FotpSmt', us.PassChecker)

router.get('/pwConfirm', authGuard.userLoggedinAuthGuard, (req, res) => {
  res.render('user/ConfirmPassword', { title: "Confirm Password" })
})

router.post('/confirmation-pass', us.getConfirmPass)
router.get('/resendOtp', us.pwSendOtp)


// =================== Password Change ===================
router.get('/changePassword', authGuard.userLoginAuthGuard, userAccess, us.passChange)
router.post('/checkPasswords', us.passwordChange2)


// =================== Cart ===================
router.get('/addToCart/:id', userAddtoCart)
router.get('/cart', authGuard.userLoginAuthGuard, userAccess, userGetCart)
router.post('/updateCartValue', cartQuantityUpdate)
router.put('/deleteCartItem/:cartId', cartItemDeletion)


// =================== Profile ===================
router.get('/profile', authGuard.userLoginAuthGuard, userAccess, getUserProfile)
router.put('/updateInfo', updateUserProfile)


// =================== Address ===================
router.get('/manageAddress', authGuard.userLoginAuthGuard, userAccess, renderManageAddress)
router.post('/saveAddress', addAddress)
router.post('/updateAddress/:userId', updateAddress)
router.get('/deleteAddress/:userId/:addresId', deleteAddress)


// =================== Orders ===================
router.get('/buyTheProduct/:productId', authGuard.userLoginAuthGuard, userAccess, checkoutUser)
router.get('/buyTheProducts', authGuard.userLoginAuthGuard, userAccess, checkoutUser)

router.route('/placeOrder')
  .get(authGuard.userLoginAuthGuard, userAccess, orderSuccessPage)
  .post(placeOrder)

router.post('/verify-payment', authGuard.userLoginAuthGuard, userAccess, verifyOrder)
router.get('/orderDetails', authGuard.userLoginAuthGuard, userAccess, renderOrderDetails)
router.get('/cancelOrderData/:orderId', cancelOrderData)
router.get('/orderProductView/:orderId', authGuard.userLoginAuthGuard, userAccess, orderedProduct)
router.post('/returnedItem', returnedItem)


module.exports = router



// // Get all cart items OR Add a new item
// router.route('/cart')
//   .get(authGuard.userLoginAuthGuard, userAccess, getCart)   // GET /cart
//   .post(authGuard.userLoginAuthGuard, userAccess, addToCart); // POST /cart (add new item)

// // Update or Delete a specific cart item
// router.route('/cart/:id')
//   .patch(authGuard.userLoginAuthGuard, userAccess, updateCartItem) // PATCH /cart/:id (update quantity)
//   .delete(authGuard.userLoginAuthGuard, userAccess, deleteCartItem); // DELETE /cart/:id (remove item)