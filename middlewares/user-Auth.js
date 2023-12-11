//goes for every route otherthan login/signup
const userLoginAuthGuard = (req,res,next)=>{
    try {
    
        if(req.session.userAuth){
            next()
        }else{
            res.redirect('/')
        }
    
    } catch (error) {
      console.error("error 500 :",error);
    }
    
}
//for login ie..before logout it will not go to login or signup
const userLoggedinAuthGuard = (req,res,next)=>{
    try {
    
        if(!req.session.loggedIn){
            next()
        }else{
            res.redirect('/userHome')
        }
    
    } catch (error) {
      console.error("error 500 :",error);
    }
    
}
module.exports = {userLoginAuthGuard,userLoggedinAuthGuard}