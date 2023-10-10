const express = require('express')
const router = express.Router()
const db = require('../models/user')
const produ = require('../models/products')
const Cate = require('../models/category')

const credential = {
    email : "a@s.m",
    password : "123"
}

router.get('/',(req,res)=>{
    res.render('supAdmin/admin-login')
})
// router.get('',)
//---------------------------------------------------------------------------------4
//customer

router.get('/Customers',async(req,res,next)=>{
    let i = 0;
    const userData = await db.find();
    res.render('supAdmin/admin-control-user',{userData,i})
    // res.send('oky')
})

// -----------------------------------------------------------------------------------------------------//
//inventory
router.get('/inventory',(req,res)=>{
    res.render('supAdmin/admin-inventory')
    // res.send('hello')
})
router.get('/inventory/addProduct',(req,res)=>{
    res.render('supAdmin/admin-addProduct')
    // res.send('hai')
})


//users
// router.get('/admin/Customers',(req,res)=>{
//     res.redirect('/admin/adminUserControl')
// })


//-----------------------------------------------------------------------------------------------------------//


router.post('/adminDash',(req,res,next)=>{
    // console.log(req.body);
    // res.send('okx')
    if(req.body.email===credential.email && req.body.password==credential.password){
        res.redirect('/admin/Customers')
    }else{
        res.send('something went wrong')
    }
}) 

// ------------------------------------------------------------------------------------------------------------//

//insert product
router.get('/inventory/addProduct',(req,res)=>{
    res.render('supAdmin/admin-addProduct')
})




//''''''''''''''''''''''''''''''''''''''''''''''''''''------------------------------------------------------------------------//





//logout

router.get('/logout',(req,res)=>{
    res.redirect('/admin');
})












module.exports = router