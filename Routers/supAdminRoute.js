const express = require('express')
const router = express.Router()
const multer = require('multer');


const category = require('../models/category')
const db = require('../models/user')
const products = require('../models/products')
const Cate = require('../models/category')
const admin = require('../models/admin')
const multi = require('../middlewares/multiImage')
const adminControl = require('../controllers/AdminControll/Admin-side');
const adminauth = require('../middlewares/admin-Auth')
const { fileLoader } = require('ejs');
const catController = require('../controllers/AdminControll/adminCategoryController')
const adminUserControl = require('../controllers/AdminControll/adminUserControl')
const adminProductControl = require('../controllers/AdminControll/adminProductControl')
const orderModel = require('../models/order');
const { default: mongoose } = require('mongoose');
const { adminLogin } = require('../controllers/AdminControll/authControll');
const { io, getReceiverSocketId } = require('../backendHelpers/socketIO');
const { getBanner, getSlides, addBanner, deleteBanner } = require('../controllers/AdminControll/bannerControll');
const { getCoupons, createCoupon, editCoupon, deleteCoupon } = require('../controllers/AdminControll/coupons');
const { getDashboard, getChart } = require('../controllers/AdminControll/Dashboard');
const { downloadCSV, downloadPdf } = require('../controllers/AdminControll/graphRequirements');
const { getOrders, updateOrder, orderDetails } = require('../controllers/AdminControll/orderControll');


router.get('/', adminauth.adminLoginAuthguard, adminControl.getAdminLogin)
// router.get('',)
//-image upload----------------------------------------------------------------------------------------------------------------///
router.post('/login', adminauth.adminLoginAuthguard,adminLogin)


//dasboard
router.get('/Dashboard',adminauth.adminAuthguard,getDashboard)
router.get('/getSalesData/:SO',adminauth.adminAuthguard,getChart)


//----------------------------------------------------------------------------------
//customer

router.get('/Customers', adminauth.adminAuthguard, adminControl.getCustomer)

// -----------------------------------------------------------------------------------------------------//
//inventory
router.get('/inventory', adminauth.adminAuthguard, adminControl.getInventory)

//----------------------------------------------------------------------------------------------
//Category------------------------<%= ++i %>----------------
router.get('/Category', adminauth.adminAuthguard, adminControl.getCategory)

//-----------------------------------------------------------------------------------------------------------------------------------------------
//add category
router.get('/addCatgory', adminauth.adminAuthguard, adminControl.addCategory)

///add-category
router.post('/add-category', catController.addCategory)

//--------------------------------------------------------------------------------------------------------------------------------------------------------
//get add product

router.route('/inventory/addProduct')
      .get(adminauth.adminAuthguard, adminControl.getAddProduct)
      .post((req,res,next)=>{
        req.uploadType='products';
        next();
      },multi.array('images', 4), adminProductControl.addProduct)





//banner
router.route('/Banner')
      .get(adminauth.adminAuthguard, getBanner)
      .post((req,res,next)=>{
        req.uploadType = 'banner'
        next()
      },multi.single('image'),addBanner)
router.get('/getSlides', getSlides)
router.delete('/deleteSlide/:id',deleteBanner)
//Coupons-------------------------------------------------------------------------------------------------------------------------------------------
router.route('/Coupons')
      .get(adminauth.adminAuthguard, getCoupons)
      .post(createCoupon)
      .put(editCoupon)

router.delete('/Coupons/:id',deleteCoupon)
//users-------------------------------------------------------------------------------------------------------------------------------//
// router.get('/admin/Customers',(req,res)=>{
//     res.redirect('/admin/adminUserControl')
// })


//-----------------------------------------------------------------------------------------------------------//


//admin email&password check----------------------------------------------------------------------------------------------//


// router.post('/check',adminControl.adminNpasswordCheck) 


// ------------------------------------------------------------------------------------------------------------//

//insert product
// router.get('/inventory/addProduct', adminauth.adminAuthguard, adminProductControl.getAdminAddProduct)




//''''''''''''''''''''''''''''''''''''''''''''''''''''------------------------------------------------------------------------//
//add product
router.post('/inventory/adding-product', (req,res,next)=>{
    req.uploadType = 'products'
    next();
}, multi.array('images', 4), adminProductControl.addProduct)



//--------------------------------------------------------------------------------------------------------------------//
//logout

router.get('/logout', (req, res) => {
    // console.log('Before---');
    // console.log("logged =",req.session.logged)
    // console.log("adminAuth = ",req.session.adminAuth);

    req.session.adminAuth = false
    req.session.logged = false
    res.redirect('/admin');

})

//----------------------------------------------------------------------------------------------------------------------
//user status------
router.get('/userBUB/:id', adminUserControl.userStatus)

//====================----------------------------------------------------------------------------------------------------------------
//user edit--==--==--=-=-=
router.get('/userEdit/:id', adminauth.adminAuthguard, adminUserControl.userEdit)

router.post('/userUpdate/:id', adminUserControl.userUpdate)
//--------------------------------------------------------------------------------------------------------------
//user delete
router.get('/userDelete/:id', adminUserControl.userDelete)
//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
//edit category

router.route('/edit-category/:id')
    .get(adminauth.adminAuthguard, catController.editCategory)

//cat update
router.route('/category-update/:id')
    .post(catController.categoryUpdate)

//-------------------------------------------------------------------------------------------------------------------
//category delete

router.route('/delete-category/:id')
    .get(catController.categoryDelete)





//--------------------------------------------------------------------------------------------------------------------------------
//product edit
router.get('/edit-product/:id', adminauth.adminAuthguard, adminProductControl.editProduct)


//updating product
router.post('/update-productPage/:P_id', (req,res,next)=>{
    req.uploadType = 'products';
    next();
}, multi.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]), adminProductControl.updateProduct)



//product image delete==================
router.put('/deleteImage/:P_id', adminProductControl.deleteImage)

//----------------------------------
//product delete

router.get('/delete-product/:id', adminProductControl.deleteProduct)




//-------------------------------------------------------------------------------------------------------------------------------------------------------------
//============================================================================================================================================================

router.get('/Orders', adminauth.adminAuthguard, getOrders)



//admin order update
router.put('/orders/updateStatus/:orderId', updateOrder)


//admin order detail view page
router.get('/orders/details/:orderId', adminauth.adminAuthguard, orderDetails)




router.post('/downloadSalesReport',downloadCSV)

router.post('/downloadSalesReportPDF',downloadPdf)








module.exports = router 