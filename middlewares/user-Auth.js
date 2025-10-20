//goes for every route otherthan login/signup
const userLoginAuthGuard = (req,res,next)=>{
    if(req.session.userAuth){
        next()
    }else{
        res.redirect('/login')
    }
}
//for login ie..before logout it will not go to login or signup
const userLoggedinAuthGuard = (req,res,next)=>{
    if(!req.session.loggedIn){
        next()
    }else{
        res.redirect('/')
    }
}
module.exports = {userLoginAuthGuard,userLoggedinAuthGuard}