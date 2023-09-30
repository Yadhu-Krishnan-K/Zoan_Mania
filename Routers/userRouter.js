const express = require('express')
const router = express.Router()
const us = require('../controllers/user-side')

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




router.post('/otp',(req,res)=>{
    res.redirect('/otpsend')
})
router.post('/home',(req,res)=>{
    res.redirect('/userHome')
})

module.exports = router