const express = require('express')
const router = express.Router()
const us = require('../controllers/user-side')
const userModel = require('../models/user')
const productInHome = require('../controllers/home-page-products')


const controller = require('../controllers/for-otp')

router.get('/',us.userLogin);

router.get('/signup',(req,res)=>{
    res.render('user/userSignUp')  
})

router.get('/otpsen',(req,res)=>{
    res.render('user/otpRegister')
})

router.get('/userHome',(req,res)=>{
    res.render('user/userHome',{productInHome})
})




router.post('/otpsend',controller.otp);

router.post('/home',(req,res)=>{
    let userOtp=req.body.number1
    // console.log(controller.vaotp)
    console.log(req.body.number1)
    if(userOtp==controller.vaotp){

     res.redirect('/userHome')
    }else{
        res.send('something went wrong')
    }
})
router.post('/homed',async(req,res)=>{
    const {email,password} = req.body;
    
    const logins = await userModel.findOne({email:email,password:password})
    if(logins){
        res.redirect('/userHome')
    }else{
        res.send('something went wrong')
    }
})







module.exports = router