const express = require('express')
const router = express.Router()
const multer = require('multer');
const category = require('../models/category')
// const storage = multer.memoryStorage()

// const upload = multer({dest:"uploads/"});

// const storage = multer.diskStorage({
//     destination:(req,file,cb)=>{
//         return cb(null,'./uploads')
//     },
//     filename: (req,file,cb)=>{
//         return cb(null,`${Date.now()}-${file.originalname}`)
//     }
// });
// const upload = multer({storage})

const db = require('../models/user')
const products = require('../models/products')
const Cate = require('../models/category')
const admin = require('../models/admin')

const multi = require('../middlewares/multiImage')
const adminrouter = require('../controllers/Admin-side');
const { fileLoader } = require('ejs');



router.get('/',adminrouter.getAdminLogin)
// router.get('',)
//-image upload----------------------------------------------------------------------------------------------------------------///






//---------------------------------------------------------------------------------4
//customer

router.get('/Customers',adminrouter.getCustomer)
 
// -----------------------------------------------------------------------------------------------------//
//inventory
router.get('/inventory',adminrouter.getInventory)
        
//----------------------------------------------------------------------------------------------
//Category------------------------<%= ++i %>----------------

router.get('/Category',async(req,res)=>{
    
    i=0
    const datas = await Cate.find()
    // console.log(datas)
    res.render('supAdmin/admin-category',{datas,i})

})

//-----------------------------------------------------------------------------------------------------------------------------------------------
//add category

router.get('/addCatgory',(req,res)=>{

    res.render('supAdmin/admin-category-add')
})

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

router.get('/inventory/addProduct',adminrouter.getAddProduct)


//users-------------------------------------------------------------------------------------------------------------------------------//
// router.get('/admin/Customers',(req,res)=>{
//     res.redirect('/admin/adminUserControl')
// })


//-----------------------------------------------------------------------------------------------------------//


//admin email&password check----------------------------------------------------------------------------------------------//


router.post('/check',adminrouter.adminNpasswordCheck) 


// ------------------------------------------------------------------------------------------------------------//

//insert product
router.get('/inventory/addProduct',(req,res)=>{
    
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
   const {Description,Pname,stock,price,category}=req.body
//     // try {
        const product =await new products({
            Description:Description,
            Name:Pname,
            Image:[imageUrls],
            Stock:stock,
            Category:category,
            Price:price,
            
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
    req.session.destroy((err)=>{
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
            Description:req.body.Description,
            Name:req.body.ProductName,
            Category:req.body.Category,
            Stock:req.body.Stock,
            Price:req.body.Price,
            Image:[imageUrls]
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
    await products.findByIdAndDelete({_id: req.params.id})
    res.redirect('/admin/inventory');

})




































module.exports = router