const adminAuthguard = (req,res,next)=>{
    try {
        console.log('reached authguard...')
        if(req.session.adminAuth) {
            next()
        }else{
            console.log('test...')
            res.redirect('/admin')
        }
    } catch (error) {
        console.log(error.message)
    }
}

const adminLoginAuthguard  = (req,res,next) => {
    try {
        if(!req.session.adminAuth){
            
            next()
        }else{
            res.redirect('/admin/Customers')
        }
    } catch (error) {
        console.log(error.message)
    }
}


module.exports = {adminLoginAuthguard,adminAuthguard};