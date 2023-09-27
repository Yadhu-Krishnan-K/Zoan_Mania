const express = require('express')
const router = express.Router()

router.get('/',(req,res)=>{
    res.render('supAdmin/admin-login')
})

module.exports = router