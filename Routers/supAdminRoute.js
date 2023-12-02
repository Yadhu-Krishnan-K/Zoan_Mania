const express = require('express')
const router = express.Router()
const multer = require('multer');
// const socketIO = require('socket.io')


const category = require('../models/category')
const db = require('../models/user')
const products = require('../models/products')
const Cate = require('../models/category')
const admin = require('../models/admin')
const multi = require('../middlewares/multiImage')
const adminrouter = require('../controllers/AdminControll/Admin-side');
const adminauth = require('../middlewares/admin-Auth')
const { fileLoader } = require('ejs');
const catController = require('../controllers/AdminControll/adminCategoryController')
const adminUserControl = require('../controllers/AdminControll/adminUserControl')
const adminProductControl = require('../controllers/AdminControll/adminProductControl')
const orderModel = require('../models/order');
const couponsModel = require('../models/coupons');
const couponController = require('../controllers/AdminControll/admin-coupon-management')
const { default: mongoose, isObjectIdOrHexString } = require('mongoose');
const ordercontroller =require('../controllers/AdminControll/admin-order')
const socketManager = require('../util/socket')



router.get('/',adminauth.adminLoginAuthguard,adminrouter.getAdminLogin)
// router.get('',)
//-image upload----------------------------------------------------------------------------------------------------------------///
router.post('/check',adminauth.adminLoginAuthguard,adminrouter.AdminCheck)


//dasboard
// router.get('/dashboard',adminauth.adminLoggedinAuthguard,adminrouter.getDashboard)


//----------------------------------------------------------------------------------
//customer

router.get('/Customers',adminauth.adminLoggedinAuthguard,adminrouter.getCustomer)
 
// -----------------------------------------------------------------------------------------------------//
//inventory
router.get('/inventory',adminauth.adminLoggedinAuthguard,adminrouter.getInventory)
        
//----------------------------------------------------------------------------------------------
//Category------------------------<%= ++i %>----------------
router.get('/Category',adminauth.adminLoggedinAuthguard,adminrouter.getCategory)

//-----------------------------------------------------------------------------------------------------------------------------------------------
//add category
router.get('/addCatgory',adminauth.adminLoggedinAuthguard,adminrouter.addCategory)

///add-category
router.post('/add-category',catController.addCategory)

//--------------------------------------------------------------------------------------------------------------------------------------------------------
//get add product

router.get('/inventory/addProduct',adminauth.adminLoggedinAuthguard,adminrouter.getAddProduct)


//users-------------------------------------------------------------------------------------------------------------------------------//
// router.get('/admin/Customers',(req,res)=>{
//     res.redirect('/admin/adminUserControl')
// })


//-----------------------------------------------------------------------------------------------------------//


//admin email&password check----------------------------------------------------------------------------------------------//


// router.post('/check',adminrouter.adminNpasswordCheck) 


// ------------------------------------------------------------------------------------------------------------//

//insert product
router.get('/inventory/addProduct',adminauth.adminLoggedinAuthguard,adminProductControl.getAdminAddProduct)




//''''''''''''''''''''''''''''''''''''''''''''''''''''------------------------------------------------------------------------//
//add product
router.post('/inventory/adding-product',multi.array('images',4),adminProductControl.postAddProduct)


//--------------------------------------------------------------------------------------------------------------------//
//logout

router.get('/logout',(req,res)=>{

    req.session.adminAuth = false
    req.session.logged = false
        res.redirect('/admin');

})

//----------------------------------------------------------------------------------------------------------------------
//user status------
router.get('/userBUB/:id',adminUserControl.userStatus)

//====================----------------------------------------------------------------------------------------------------------------
//user edit--==--==--=-=-=
router.get('/userEdit/:id',adminauth.adminLoggedinAuthguard,adminUserControl.userEdit)

router.post('/userUpdate/:id',adminUserControl.userUpdate)
//--------------------------------------------------------------------------------------------------------------
//user delete
router.get('/userDelete/:id',adminUserControl.userDelete)
//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
//edit category

router.route('/edit-category/:id')
    .get(adminauth.adminLoggedinAuthguard,catController.editCategory)

//cat update
router.route('/category-update/:id')
    .post(catController.categoryUpdate)

//-------------------------------------------------------------------------------------------------------------------
//category delete

router.route('/delete-category/:id')
    .get(catController.categoryDelete)





//--------------------------------------------------------------------------------------------------------------------------------
//product edit
router.get('/edit-product/:id',adminauth.adminLoggedinAuthguard,adminProductControl.getAdminEditProduct)


    //updating product
router.post('/update-productPage/:P_id',multi.fields([
{ name: 'image1', maxCount: 1 },{ name: 'image2', maxCount: 1 },{ name: 'image3', maxCount: 1 },{ name: 'image4', maxCount: 1 }]),adminProductControl.postProductEdit)



//product image delete==================
router.put('/deleteImage/:P_id',adminProductControl.deleteSingleImage)

//----------------------------------
//product delete

router.get('/delete-product/:id',adminProductControl.deleteProduct)




//-------------------------------------------------------------------------------------------------------------------------------------------------------------
//============================================================================================================================================================

router.get('/Orders',adminauth.adminLoggedinAuthguard,ordercontroller.getOrder)



//admin order update
router.put('/orders/updateStatus/:orderId',ordercontroller.updateOrderStatus)


//admin order detail view page
router.get('/orders/details/:orderId',adminauth.adminLoggedinAuthguard,ordercontroller.orderDetailPage)


router.put('/updatReturnStatus/:orderId',ordercontroller.updateReturnStatus)



//coupon management=======================================000000000000000000000000000000000----------------
router.get('/Coupons', adminauth.adminLoggedinAuthguard, couponController.getCoupons)

router.post('/addCoupons',couponController.addCoupons)

router.put('/CouponEdit/:couponId',adminauth.adminLoggedinAuthguard,couponController.EditCoupon)

router.delete('/deleteCoupon/:couponId',couponController.deleteCoupon)









module.exports = router 