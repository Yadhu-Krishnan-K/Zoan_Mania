const express = require('express')
const router = express.Router()
const us = require('../controllers/user-side')
const userModel = require('../models/user')
// const monmodel= require('../models/user')

const productInHome = require('../controllers/home-page-products')


const controller = require('../controllers/for-otp')

router.get('/',us.userLogin);

router.get('/signup',(req,res)=>{
    res.render('user/userSignUp')  
})

// router.get('/otpsen',(req,res)=>{
//     // console.log(controller.vaotp)
//     // const {name,email,password}=req.session.data;
//     // const logged=await userModel.create({name,email,password});
//     // console.log(logged)
//     res.render('user/otpRegister')
// })


//--------------------------------------------------------------------------------------------------------------------------//
//userHome


router.get('/userHome',(req,res)=>{
    const name = req.session.name
    console.log(name)
    res.render('user/userHome',{productInHome,name})
})




router.post('/otpsend',controller.otp);

router.get('/otpsen',(req,res)=>{
    console.log(controller.vaotp)
    res.render('user/otpRegister')
})
 
router.post('/home',async(req,res)=>{
    let userOtp=req.body.number1
    console.log(controller.vaotp)
    const {name,email,password}=req.session.data;
    req.session.name = name
    console.log(req.body.number1)
    console.log(controller.vaotp)
    const logins = await userModel.findOne({email:email})
if(!logins){
    if(userOtp==controller.vaotp){
        
        const logged=await userModel.create({name,email,password});
        console.log(logged)
     res.redirect('/userHome')
    }else{
        res.send('something went wrong')
        // res.render('/signup',{text:"enter valid otp"})
    }
}else{
    // res.render('/signup',{text:"email already exist"})
    res.send('email already exists')
}
})



router.post('/homed',async(req,res)=>{
    const {email,password} = req.body;
    
    const logins = await userModel.findOne({email:email,password:password})
    console.log(logins)
    req.session.name = logins.name
    if(logins){
        res.redirect('/userHome')
    }else{
        res.send('something went wrong')
    }
})







module.exports = router