const express = require('express')
const router = express.Router()
const multer = require('multer');


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
const orderModel = require('../models/order')



router.get('/',adminauth.adminLoginAuthguard,adminrouter.getAdminLogin)
// router.get('',)
//-image upload----------------------------------------------------------------------------------------------------------------///






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


router.post('/check',adminrouter.adminNpasswordCheck) 


// ------------------------------------------------------------------------------------------------------------//

//insert product
router.get('/inventory/addProduct',adminauth.adminLoggedinAuthguard,adminProductControl.getAdminAddProduct)




//''''''''''''''''''''''''''''''''''''''''''''''''''''------------------------------------------------------------------------//
//add product
router.post('/inventory/adding-product',multi.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 }
]),async(req,res)=>{
    // const name = req.body.name
//    console.log(req.body);
//    console.log(req.files,'files');

   const image1 = req.files['image1'][0];
   const image2 = req.files['image2'][0];
   const image3 = req.files['image3'][0];

   const imageUrls = {
    mainimage: image1.filename, // Use .path to get the file path
    image1: image2.filename,
    image2: image3.filename,
   };
   const {Description,Pname,stock,price,category,Specification1,Specification2,Specification3,Suffix}=req.body
//     // try {
        const product =await new products({
            Description:Description,
            Name:Pname,
            Image:[imageUrls],
            Stock:stock,
            Category:category,
            Price:price,
            Spec1:Specification1,
            Spec2:Specification2,
            Spec3:Specification3,
            Suffix:Suffix
        })
        const newProduct = await product.save();
        // console.log(newProduct);
        res.redirect('/admin/inventory')
        // res.send('success')
    // } catch (error) {
    //     res.status(500).json({error:'Error adding data to the collection'})
    // }
})



//--------------------------------------------------------------------------------------------------------------------//
//logout

router.get('/logout',(req,res)=>{
    // console.log('Before---');
    // console.log("logged =",req.session.logged)
    // console.log("adminAuth = ",req.session.adminAuth);

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
router.get('/edit-product/:id',adminauth.adminLoggedinAuthguard,async(req,res)=>{
        const id = req.params.id
        const P_detail = await products.findOne({_id: id})
        const cate = await Cate.find()
        console.log("efef",cate);
        // console.log(P_detail);
        res.render('supAdmin/admin-edit-product',{P_detail,cate,title:"Edit Product",currentPage:"Inventory"});
    })

    //updating product
    router.post('/update-productPage/:P_id',multi.fields([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 }
    ]),async(req,res)=>{

        const P_id = req.params.P_id
        const productData = await products.findOne({_id:P_id})
        // console.log("image1",productData.Image[0].mainimage)
        // console.log("image1",productData.Image[0].image1)
        // console.log("image1",productData.Image[0].image2)
        const image1 = req.files && req.files['image1'] ? req.files['image1'][0] : { filename: productData.Image[0].mainimage };
        const image2 = req.files && req.files['image2'] ? req.files['image2'][0] : { filename: productData.Image[0].image1 };
        const image3 = req.files && req.files['image3'] ? req.files['image3'][0] : { filename: productData.Image[0].image2 };

        console.log("image.filename===",image1)
        const imageUrls = {
            mainimage: image1.filename ,
            image1: image2.filename ,
            image2: image3.filename 
        };


            // const {Description,ProductName,Category,Stock,Price} = req.body

        const data = {
            Name:req.body.ProductName,
            Description:req.body.Description,
            Category:req.body.Category,
            Stock:req.body.Stock,
            Price:req.body.Price,
            Image:[imageUrls],
            Spec1:req.body.Spec1,
            Spec2:req.body.Spec2,
            Spec3:req.body.Spec3

        }
        const updatedProduct = await products.findByIdAndUpdate(P_id, data);
        if (!updatedProduct) {
                return res.status(404).send('Product not found');
        }
        res.redirect('/admin/inventory');
        
    }
    
    
    )

//----------------------------------
//product delete

router.get('/delete-product/:id',adminProductControl.deleteProduct)




//-------------------------------------------------------------------------------------------------------------------------------------------------------------
//============================================================================================================================================================

router.get('/Orders',adminauth.adminLoggedinAuthguard,async(req,res)=>{
    const ordersData = await orderModel.find()
    res.render('supAdmin/admin-order-tracker',{title:"Orders",ordersData,currentPage:"Orders"})
})



//admin order update

router.put('/orders/updateStatus/:orderId',async(req,res)=>{
    const orderId = req.params.orderId
    const newStatus = req.body.newStatus
    await orderModel.findByIdAndUpdate(orderId,{Status:newStatus})
})


//admin order detail view page
router.get('/orders/details/:orderId',adminauth.adminLoggedinAuthguard,async(req,res)=>{
    let orderId=req.params.orderId;
    let order = await orderModel.findOne({_id: orderId}).populate('Items.productId')
    let ProductAllDetails = order.Items
    // console.log("Order items in adminside====",ProductAllDetails)
    res.render('supAdmin/adminSide-order-detail-page',{title:"Order Detail",ProductAllDetails})
    
})





















module.exports = router 