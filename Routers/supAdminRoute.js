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


router.get('/', adminauth.adminLoginAuthguard, adminControl.getAdminLogin)
// router.get('',)
//-image upload----------------------------------------------------------------------------------------------------------------///
router.post('/login', adminauth.adminAuthguard, async (req, res) => {
    try {
        let { email, password } = req.body;
        console.log('email,password = ', email, password)

        // Hash the password and then query the database
        let adminL = await admin.findOne({ adminGmail: email, adminPassword: password });

        if (!adminL) {
            res.json({
                success: false
            });
        } else {
            console.log("Success");
            req.session.adminAuth = true;
            res.json({
                success: true
            });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({
            success: false,
            error: "Internal Server Error"
        });
    }
})


//dasboard
// router.get('/dashboard',adminauth.adminAuthguard,adminControl.getDashboard)


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

router.get('/inventory/addProduct', adminauth.adminAuthguard, adminControl.getAddProduct)


//users-------------------------------------------------------------------------------------------------------------------------------//
// router.get('/admin/Customers',(req,res)=>{
//     res.redirect('/admin/adminUserControl')
// })


//-----------------------------------------------------------------------------------------------------------//


//admin email&password check----------------------------------------------------------------------------------------------//


// router.post('/check',adminControl.adminNpasswordCheck) 


// ------------------------------------------------------------------------------------------------------------//

//insert product
router.get('/inventory/addProduct', adminauth.adminAuthguard, adminProductControl.getAdminAddProduct)




//''''''''''''''''''''''''''''''''''''''''''''''''''''------------------------------------------------------------------------//
//add product
router.post('/inventory/adding-product', multi.array('images', 4), async (req, res) => {
    // const name = req.body.name
    //    console.log(req.body);
    console.log("req.files====", req.files, 'files');

    const images = req.files;
    console.log("images===", images)

    const imageUrls = images.map(file => file.filename)
    let arr = []

    for (i = 0; i < imageUrls.length; i++) {
        let ar = imageUrls[i].split('.')
        arr.push(ar[1])
    }
    for (i = 0; i < arr.length; i++) {
        if (!(arr[i].includes("jpg", "jpeg", "png"))) {
            return res.render('supAdmin/422error')
        }
    }

    console.log("when adding product, img==", imageUrls);
    const { Description, Pname, stock, price, category, Specification1, Specification2, Specification3, Suffix } = req.body
    //     // try {
    const product = await new products({
        Description: Description,
        Name: Pname,
        Image: imageUrls,
        Stock: stock,
        Category: category,
        Price: price,
        Spec1: Specification1,
        Spec2: Specification2,
        Spec3: Specification3,
        Suffix: Suffix
    })
    const newProduct = await product.save();
    // console.log(newProduct);

    res.redirect('/admin/inventory')

})



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
router.get('/edit-product/:id', adminauth.adminAuthguard, async (req, res) => {
    const id = req.params.id
    const P_detail = await products.findOne({ _id: id })
    const cate = await Cate.find()
    console.log("efef", cate);
    console.log(P_detail.Image);
    res.render('supAdmin/admin-edit-product', { P_detail, cate, title: "Edit Product", Page: "Inventory" });
})


//updating product
router.post('/update-productPage/:P_id', multi.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]), async (req, res) => {

    const P_id = req.params.P_id
    const productData = await products.findOne({ _id: P_id })
    const image1 = req.files && req.files.image1 ? req.files.image1[0].filename : (productData.Image[0] ? productData.Image[0] : '0');
    const image2 = req.files && req.files.image2 ? req.files.image2[0].filename : (productData.Image[1] ? productData.Image[1] : '0');
    const image3 = req.files && req.files.image3 ? req.files.image3[0].filename : (productData.Image[2] ? productData.Image[2] : '0');
    const image4 = req.files && req.files.image4 ? req.files.image4[0].filename : (productData.Image[3] ? productData.Image[3] : '0');

    console.log("image.filename===", image1)
    const imageUrls = [
        image1,
        image2,
        image3,
        image4
    ];
    const images = imageUrls.filter(img => img !== '0')
    console.log("/update-product=======", images)


    // const {Description,ProductName,Category,Stock,Price} = req.body

    const data = {
        Name: req.body.ProductName,
        Description: req.body.Description,
        Category: req.body.Category,
        Stock: req.body.Stock,
        Price: req.body.Price,
        Image: images,
        Spec1: req.body.Spec1,
        Spec2: req.body.Spec2,
        Spec3: req.body.Spec3

    }
    const updatedProduct = await products.findByIdAndUpdate(P_id, data);
    if (!updatedProduct) {
        return res.status(404).send('Product not found');
    }
    res.redirect('/admin/inventory');

}


)



//product image delete==================
router.put('/deleteImage/:P_id', async (req, res) => {
    const P_id = new mongoose.Types.ObjectId(req.params.P_id)
    const num = req.body.num

    const productDetail = await products.findOneAndUpdate({ _id: P_id }, {})
    let removed = productDetail.Image.splice(num, 1)
    console.log("productDetail after deleting an image from an array")
    console.log(removed)
    await productDetail.save()
    res.json({ success: true })

})

//----------------------------------
//product delete

router.get('/delete-product/:id', adminProductControl.deleteProduct)




//-------------------------------------------------------------------------------------------------------------------------------------------------------------
//============================================================================================================================================================

router.get('/Orders', adminauth.adminAuthguard, async (req, res) => {
    // const ordersData = await orderModel.find()
    // res.render('supAdmin/admin-order-tracker',{title:"Orders",ordersData,currentPage:"Orders"})
    const page = parseInt(req.query.page) || 1;
    const options = {
        page: page,
        limit: 6,
        sort: { _id: -1 }
    };

    const ordersData = await orderModel.paginate({}, options);

    res.render('supAdmin/admin-order-tracker', {
        title: "Orders",
        ordersData: ordersData.docs,
        Page: 'Orders',
        totalPages: ordersData.totalPages,
        currentPage: ordersData.page
    });

})



//admin order update
router.put('/orders/updateStatus/:orderId', async (req, res) => {
    const orderId = req.params.orderId
    const newStatus = req.body.newStatus
    await orderModel.findByIdAndUpdate(orderId, { Status: newStatus })
})


//admin order detail view page
router.get('/orders/details/:orderId', adminauth.adminAuthguard, async (req, res) => {
    let orderId = req.params.orderId;
    let order = await orderModel.findOne({ _id: orderId }).populate('Items.productId')
    let ProductAllDetails = order.Items
    res.render('supAdmin/adminSide-order-detail-page', { title: "Order Detail", ProductAllDetails, Page: "Orders" })
})





















module.exports = router 