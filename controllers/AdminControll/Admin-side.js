const admin = require('../../models/admin')
const db = require('../../models/user')
const productModel =require('../../models/products')
const Categories = require('../../models/category')

const getAdminLogin = (req,res)=>{
    res.render('supAdmin/admin-login')}


const getCustomer = async(req,res,next)=>{
    req.session.logged = true
    let i = 0;
    const userData = await db.find();
    res.render('supAdmin/admin-control-user',{userData,i,})
    // res.send('oky')
}


const getInventory = async(req,res)=>{
    try {
        i=0
        const products = await productModel.find({})
        res.render('supAdmin/admin-inventory',{products,i})
    } catch (error) {
        console.log(error)
    }
    
    // res.send('hello')
}


const getAddProduct = async(req,res)=>{
    const categorys = await Categories.find({})
    res.render('supAdmin/admin-addProduct',{categorys})

    // res.send('hai')
}

const adminNpasswordCheck = async(req,res,next)=>{
    // console.log(req.body);
    // res.send('okx')
    const {email,password}=req.body
    // const logged = await admin.create({adminGmail:email,adminPassword:password})

    const Demail = await admin.findOne({email})
    // console.log(Demail.adminGmail);

    const Dpassword = await admin.findOne({password})
    // console.log(Dpassword.adminPassword);

    if(req.body.email===Demail.adminGmail && req.body.password==Dpassword.adminPassword){
        req.session.adminAuth = true;
        res.redirect('/admin/Customers')
    }else{
        res.render('supAdmin/admin-login',{error:"Check your email and password"})
    }
}
//================================================================================================================
//admin-category---------------------------
const getCategory = async(req,res)=>{
    
    i=0
    const datas = await Categories.find()
    // console.log(datas)
    res.render('supAdmin/admin-category',{datas,i})

}
//===============================================================================================================
//----const add-category
const addCategory = (req,res)=>{
    res.render('supAdmin/admin-category-add')
}



module.exports = {
    getAdminLogin,
    getCustomer,
    getInventory,
    getAddProduct,
    adminNpasswordCheck,
    getCategory,
    addCategory
}