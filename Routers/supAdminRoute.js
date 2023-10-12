const express = require('express')
const router = express.Router()
const multer = require('multer');
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


router.post('')



//---------------------------------------------------------------------------------4
//customer

router.get('/Customers',adminrouter.getCustomer)
 
// -----------------------------------------------------------------------------------------------------//
//inventory
router.get('/inventory',adminrouter.getInventory)
        
//----------------------------------------------------------------------------------------------
//Category----------------------------------------

router.get('/Category',(req,res)=>{
    res.render('supAdmin/admin-category')
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
})




//''''''''''''''''''''''''''''''''''''''''''''''''''''------------------------------------------------------------------------//
//add product
router.post('/inventory/adding-product',multi.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 }
]),async(req,res)=>{
    // const name = req.body.name
   console.log(req.body);
   console.log(req.files,'files');

   const image1 = req.files['image1'][0];
   const image2 = req.files['image2'][0];
   const image3 = req.files['image3'][0];

   const imageUrls = {
    mainimage: image1.filename, // Use .path to get the file path
    image1: image2.filename,
    image2: image3.filename,
   };
   const {Description,Pname,stock,price}=req.body
//     // try {
        const product =await new products({
            Description:Description,
            Name:Pname,
            Image:[imageUrls],
            Stock:stock,
            // Category:,
            Price:price,
            
        })
        const newProduct = await product.save();
        console.log(newProduct);
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





module.exports = router