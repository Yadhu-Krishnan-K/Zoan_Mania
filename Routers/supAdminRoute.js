const express = require('express')
const router = express.Router()
const db = require('../models/user')

const credential = {
    email : "a@s.m",
    password : "123"
}

router.get('/',(req,res)=>{
    res.render('supAdmin/admin-login')
})
router.get('',)
router.get('/adminUserControl',async(req,res,next)=>{
    let i = 0;
    const userData = await db.find();
    res.render('supAdmin/admin-control-user',{title:"userdata",userData,i})
    // res.send('oky')
})

//inventory
router.get('/admin/inventory',(req,res)=>{
    res.render('supAdmin/admin-inventory')
})

//users
router.get('/admin/Customers',(req,res)=>{
    res.render('supAdmin/adnim-control-user')
})





router.post('/adminDash',(req,res,next)=>{
    // console.log(req.body);
    // res.send('okx')
    if(req.body.email===credential.email && req.body.password==credential.password){
        res.redirect('/admin/adminUserControl')
    }else{
        res.send('something went wrong')
    }
})


module.exports = router