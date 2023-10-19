const adminLoggedinAuthguard = (req,res,next)=>{
    if(req.session.adminAuth) {
        next()
    }else{
        res.redirect('/admin')
    }
}

const adminLoginAuthguard  = (req,res,next) => {
    if(!req.session.logged){
        next()
    }else{
        res.redirect('/admin/Customers')
    }
}


module.exports = {adminLoginAuthguard,adminLoggedinAuthguard};