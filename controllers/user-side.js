const userModel = require('../models/user')
const productInHome = require('../controllers/home-page-products')





//userlogin
const userLogin = (req,res)=>{
    res.render('user/userLogin')
    // res.send("done")
}


const userSignup = (req,res)=>{
    res.render('user/userSignUp')  
}


const getHome = (req,res)=>{
    const name = req.session.name
    console.log(name)
    
    res.render('user/userHome',{productInHome,name})
    
}


const otpForm = (req,res)=>{
    console.log(controller.vaotp)
    res.render('user/otpRegister')
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//entering home--------------------
const postEnteringHOme = async(req,res)=>{
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
        req.session.userId = await userModel.findOne({email:email},{_id:1})
     res.redirect('/userHome')
    }else{
        res.send('something went wrong')
        // res.render('/signup',{text:"enter valid otp"})
    }
}else{
    // res.render('/signup',{text:"email already exist"})
    res.send('email already exists')
}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

const userLoginBackend = async(req,res)=>{
    const {email,password} = req.body;
    
    const logins = await userModel.findOne({email:email,password:password})
    console.log(logins)
    req.session.name = logins.name
    if(logins){
        req.session.userId = await userModel.findOne({email:email},{_id: 1})
        console.log('userId='+req.session.userId)
        res.redirect('/userHome')
    }else{
        res.send('something went wrong')
    }
}





module.exports = {
    userLogin,
    userSignup,
    getHome,
    otpForm,
    postEnteringHOme,
    userLoginBackend
}