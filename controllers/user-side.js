const userModel = require('../models/user')
const productInHome = require('../controllers/home-page-products')

const controller = require('../controllers/for-otp')

const bcrypt = require('bcrypt')
const saltRounds = 10

 

//userlogin
const userLogin = (req,res)=>{
    res.render('user/userLogin',{title:"login"})
    // res.send("done")
}


const userSignup = (req,res)=>{
    res.render('user/userSignUp',{title:"SignuUp"})  
}


const getHome = (req,res)=>{
    const name = req.session.name
    console.log(name)
    
    res.render('user/userHome',{title:"Zoan Home",productInHome,name})
    
}


const otpForm = (req,res)=>{
    console.log(controller.vaotp)
    res.render('user/otpRegister',{title:"Register"})
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
        const hashPass = await bcrypt.hash(req.session.data.password,saltRounds)
    //    const hashpassword =  bcrypt.genSalt(saltRounds).then(salt => {console.log('Salt: ', salt)
    //         return bcrypt.hash(req.session.data.password, salt)
    //     }).then(hash => {
    //         console.log('Hash: ', hash)
    //     }).catch(err => console.error(err.message))
        

        const logged=await userModel.create({name,email,password:hashPass});
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
    
    const logins = await userModel.findOne({email:email})
    let isChecked = await bcrypt.compare(password,logins.password)
    
    req.session.name = logins.name
    // const check = await userModel.findOne({email:email},{access:1})
    console.log(logins.access)
    if(isChecked == true && logins.access){
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