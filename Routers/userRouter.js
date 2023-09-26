const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{
    res.render('user/userLogin')
})
router.get('/signup',(req,res)=>{
    res.render('user/user-signup.ejs')
})

module.exports = router