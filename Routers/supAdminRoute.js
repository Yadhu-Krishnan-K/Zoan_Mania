const express = require('express')
const router = express.Router()
const multer = require('multer');


const category = require('../models/category')
const db = require('../models/user')
const products = require('../models/products')
const Cate = require('../models/category')
const admin = require('../models/admin')
const multi = require('../middlewares/multiImage')
const adminrouter = require('../controllers/Admin-side');
const adminauth = require('../middlewares/admin-Auth')
const { fileLoader } = require('ejs');



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
router.post('/add-category',async(req,res)=>{
    // console.log(req.body.cate)
    // const categ = await new category({
        const catName = req.body.cate
    // })
    // console.log(catName);
    const cat = await category.find({catName:{$regex: "^" + catName, $options: "i"}})
    console.log(cat)
    if(cat == "[]"){
        res.redirect('admin/addCatgory')
    }
    else if (cat.length>0) {
        //    console.log(req.files,'files');
        res.render('supAdmin/admin-category-add', { error: 'The category already exists' });

    } else {
        const colleeeection = await category.create({catName:catName})
    res.redirect('/admin/Category') 
    }
})

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
router.get('/inventory/addProduct',adminauth.adminLoggedinAuthguard,(req,res)=>{
    
    res.render('supAdmin/admin-addProduct')  
    // res.send('hei')
})




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
    console.log('Before---');
    console.log("logged =",req.session.logged)
    console.log("adminAuth = ",req.session.adminAuth);

    req.session.destroy((err)=>{
        console.log(err)
        res.redirect('/admin'); 
    })
    
})

//---------------------------------------------------------------------------------------------------------------------
//multer test
 



// router.post("/upload",upload.single("profileImage"),(req,res)=>{
//     console.log(req.body)
//     console.log(req.file);
//     return res.redirect('/')
// })
// router.get('/exampleForm',(req,res)=>{
//     res.render('supAdmin/multerExample')
// })





//--------------------------------------------------------------------------------------------------------------------------

//user status------
router.get('/userBUB/:id',async(req,res)=>{
    const id = req.params.id
    const foo = await db.findOne({_id : id})
    if(foo.access){
        await db.updateOne({_id: id},{$set:{
            access:false
        }});
    }else{
        await db.updateOne({_id: id},{$set:{
            access:true
        }});
    }
    const userData = await db.find()
    let i = 0
    res.render("supAdmin/admin-control-user", { userData, i })


})
//====================----------------------------------------------------------------------------------------------------------------
//user edit

router.get('/userEdit/:id',async(req,res)=>{
    const id = req.params.id
    const user_data = await db.findOne({_id : id})
    res.render('supAdmin/adminUserEdit',{user_data})
})

router.post('/userUpdate/:id',async(req,res)=>{
    const id = req.params.id
    const CName = req.body.Uname;
    await db.updateOne({_id:id},{$set:{
        name:CName  
    }})
    res.redirect('/admin/Customers')

})
//--------------------------------------------------------------------------------------------------------------
//user delete
router.get('/userDelete/:id',async(req,res)=>{
    const id = req.params.id;
    await db.deleteOne({_id:id})
    res.redirect('/admin/Customers')
})
//---------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------
//edit category

router.route('/edit-category/:id')
    .get(async(req,res)=>{
        const id = req.params.id;
        const category = await Cate.findOne({_id:id})
        res.render('supAdmin/admin-category-edit',{category})

    })

//cat update
router.route('/category-update/:id')
    .post(async(req,res)=>{
        await Cate.updateOne({_id:req.params.id},{
            catName:req.body.catName
        })
        res.redirect('/admin/Category')
    })

//-------------------------------------------------------------------------------------------------------------------
//category delete

router.route('/delete-category/:id')
    .get(async(req,res)=>{
        const id = req.params.id
        await Cate.deleteOne({_id:id})
        res.redirect('/admin/Category')
    })





//--------------------------------------------------------------------------------------------------------------------------------
//product edit
router.get('/edit-product/:id',async(req,res)=>{
        const id = req.params.id
        const P_detail = await products.findOne({_id: id})
        const cate = await Cate.find()
        // console.log(P_detail);
        res.render('supAdmin/admin-edit-product',{P_detail,cate});
    })

    //updating product
    router.post('/update-productPage/:id',multi.fields([
        { name: 'image1', maxCount: 1 },
        { name: 'image2', maxCount: 1 },
        { name: 'image3', maxCount: 1 }
    ]),async(req,res)=>{
        const image1 = req.files['image1'][0];
        const image2 = req.files['image2'][0];
        const image3 = req.files['image3'][0];

        const imageUrls = {
            mainimage: image1.filename, // Use .path to get the file path
            image1: image2.filename,
            image2: image3.filename,
        };


        const P_id = req.params.id
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
        return res.status(404).send('Product not found');}
        res.redirect('/admin/inventory');
        
    }

    
    )

//----------------------------------
//product delete

router.get('/delete-product/:id',async(req,res)=>{
    const data = await products.findOne({_id: req.params.id})
    if(data.visible===true){
        await products.updateOne({_id: req.params.id},{$set:{visible:false}})
    }else{
        await products.updateOne({_id: req.params.id},{$set:{visible:true}})
    }
    // await products.findByIdAndDelete({_id: req.params.id})
    res.redirect('/admin/inventory');

})

































module.exports = router 