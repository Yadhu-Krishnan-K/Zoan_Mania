const userModel = require('../models/user')
const productInHome = require('../controllers/home-page-products')

const controller = require('../controllers/for-otp')
const otpModel = require('../models/otpModel')


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
    req.session.loggedIn = true;
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
    console.log(req.session.data)
    const {name,email,password}=req.session.data;
    
    req.session.name = name

    // const Dbzotp = await new otpModel({
    //     otp:controller.vaotp
    // })
    // const newOtp = await Dbzotp.save();

    const logins = await userModel.findOne({email:email})
    // if(newOtp!==undefined){
    //     setTimeout(async()=>{
    //         await otpModel.delete({})
    //         newOtp = undefined
    //     },60000)
    // }
    if(!logins){
    if(userOtp==controller.vaotp){
        const hashPass = await bcrypt.hash(req.session.data.password,saltRounds)
        req.session.userAuth = true;
        
        // await otpModel.delete()

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
    // console.log(email);
    
    const logins = await userModel.findOne({email: email})
    // console.log(logins)
    console.log(logins)
    if(!logins){
        res.render('user/userLogin',{txt:"No users found",title: "Login"})
    }else{
        let isChecked = await bcrypt.compare(password,logins.password)
        
        req.session.name = logins.name
        // const check = await userModel.findOne({email:email},{access:1})
        console.log(logins.access)
        if(isChecked == true && logins.access){
            req.session.userAuth = true;
            req.session.userId = await userModel.findOne({email:email},{_id: 1})
            console.log('userId='+req.session.userId)
            res.redirect('/userHome')
        }else{
            res.send('something went wrong')
        }
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