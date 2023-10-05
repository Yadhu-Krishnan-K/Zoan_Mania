const express = require('express')
const router = express.Router()
const us = require('../controllers/user-side')
const monmodel= require('../models/user')

router.get('/',us.userLogin)
router.get('/signup',(req,res)=>{
    res.render('user/userSignUp')
    
})
router.get('/otpsend',(req,res)=>{
    res.render('user/otpRegister')
})
router.get('/userHome',(req,res)=>{
    res.render('user/userHome')
})




router.post('/otp',async(req,res)=>{
    
    const {name,email,password}=req.body;
    const logged=await monmodel.create({name,email,password});
    if (logged) {
        
        
    console.log(logged)
    res.redirect('/otpsend')
    

    }else{
        console.log("something went wron");
    }


})
router.post('/home',(req,res)=>{
    res.redirect('/userHome')
})

module.exports = router