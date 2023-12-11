const adminLoggedinAuthguard = (req,res,next)=>{
    try {
    
        if(req.session.adminAuth) {
            next()
        }else{
            res.redirect('/admin')
        }
    
    } catch (error) {
      console.error("error 500 :",error);
    }
    
}

const adminLoginAuthguard  = (req,res,next) => {
    try {
    
        if(!req.session.logged){
            next()
        }else{
            res.redirect('/admin/Customers')
        }
    
    } catch (error) {
      console.error("error 500 :",error);
    }
    
}


module.exports = {adminLoginAuthguard,adminLoggedinAuthguard};