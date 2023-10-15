const admin = require('../models/admin')
const db = require('../models/user')
const productModel =require('../models/products')

const getAdminLogin = (req,res)=>{
    res.render('supAdmin/admin-login')}


const getCustomer = async(req,res,next)=>{
    let i = 0;
    const userData = await db.find();
    res.render('supAdmin/admin-control-user',{userData,i,})
    // res.send('oky')
}


const getInventory = async(req,res)=>{
    try {
        const products = await productModel.find({})
        res.render('supAdmin/admin-inventory',{products})
    } catch (error) {
        console.log(error)
    }
    
    // res.send('hello')
}


const getAddProduct = (req,res)=>{
    res.render('supAdmin/admin-addProduct')
    // res.send('hai')
}

const adminNpasswordCheck = async(req,res,next)=>{
    // console.log(req.body);
    // res.send('okx')
    const {email,password}=req.body
    // const logged = await admin.create({adminGmail:email,adminPassword:password})

    const Demail = await admin.findOne({email})
    console.log(Demail.adminGmail);

    const Dpassword = await admin.findOne({password})
    console.log(Dpassword.adminPassword);

    if(req.body.email===Demail.adminGmail && req.body.password==Dpassword.adminPassword){
        res.redirect('/admin/Customers')
    }else{
        res.send('something went wrong')
    }
}



module.exports = {
    getAdminLogin,
    getCustomer,
    getInventory,
    getAddProduct,
    adminNpasswordCheck,

}