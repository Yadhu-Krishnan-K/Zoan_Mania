
const admin = require('../../models/admin')
const db = require('../../models/user')
const productModel =require('../../models/products')
const Categories = require('../../models/category')

const getAdminLogin = (req,res)=>{
    res.render('supAdmin/admin-login')}



const AdminCheck = async(req,res)=>{
    try {
        console.log("reached /check")
        let email = req.body.email;
        let password = req.body.password;
        
        // Hash the password and then query the database
        let adminL = await admin.findOne({ adminGmail: email, adminPassword: password });
        console.log('adminL===',adminL)
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
}


const getCustomer = async(req,res,next)=>{
    req.session.logged = true;
    let i = 0;

    // Pagination logic
    const page = parseInt(req.query.page) || 1;
    const options = {
      page: page,
      limit: 5,
    };

    const userData = await db.paginate({}, options);

    res.render('supAdmin/admin-control-user', {
      userData: userData.docs, // Array of documents for the current page
      i,
      title: "Customers",
      Page: "Customers",
      totalPages: userData.totalPages,
      currentPage: userData.page,
    });
}


const getInventory = async(req,res)=>{
    try {
        i=0
        const listCount = await productModel.find().count()
        let page = Number(req.query.page) || 1;
        let perPage = 3
        let pageNums = Math.ceil(listCount/perPage)
        let currentPage = page;
        const products = await productModel.find().sort({_id: -1})
        .skip((page-1)*perPage)
        .limit(perPage)
        res.render('supAdmin/admin-inventory',{products,i,title:"Inventory",Page:"Inventory",page,pageNums,currentPage})
    } catch (error) {
        console.log(error)
    }
// res.send('hello')
}


const getAddProduct = async(req,res)=>{
    const cate = await Categories.find().sort()
    res.render('supAdmin/admin-addProduct',{cate,title:"Add Products",Page:"Inventory"})

    // res.send('hai')
}


//================================================================================================================
//admin-category---------------------------
const getCategory = async(req,res)=>{
    
    i=0
    const datas = await Categories.find()
    // console.log(datas)
    res.render('supAdmin/admin-category',{datas,i,title:"Categories",Page:"Category"})

}
//===============================================================================================================
//----const add-category
const addCategory = (req,res)=>{
    res.render('supAdmin/admin-category-add',{title:"Add category",Page:"Category"})
}





module.exports = {
    AdminCheck,
    getAdminLogin,
    getCustomer,
    getInventory,
    getAddProduct,
    // adminNpasswordCheck,
    getCategory,
    addCategory
}