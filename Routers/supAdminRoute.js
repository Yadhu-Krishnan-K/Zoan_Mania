const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{
    res.render('supAdmin/admin-login')
})
router.get('/adminUserControl',(req,res,next)=>{
    res.render('supAdmin/sidebar')
    // res.send('oky')
})






router.post('/adminDash',(req,res,next)=>{
    // console.log(req.body);
    // res.send('okx')
    res.redirect('/admin/adminUserControl')
})


module.exports = router