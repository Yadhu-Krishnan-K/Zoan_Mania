const userModel = require('../../models/user')
const productInHome = require('./home-page-products')
const products = require('../../models/products')
const cartModel = require('../../models/cartModel')
const mongoose = require('mongoose')


const controller = require('/home/berthold/Desktop/brototype/week_8/Zoan_proto/util/for-otp')
// const otpModel = require('../models/otpModel')async(req,res)=>{
// console.log("your email is = ",req.session.email)
// const data = await userModel.findOne({email: req.session.email})
// const hashPass = await bcrypt.hash(req.body.password,10)
// await userModel.updateOne({email: req.session.email},{password: hashPass})
// res.redirect('\login')
// }

 
const bcrypt = require('bcrypt')
const { password } = require('../../util/passwordValidator')
//c//onst products = require('../../models/products')
const saltRounds = 10

  

//userlogin
const userLogin = (req, res) => {
    let txt = req.session.txt;
    if (req.session.err) {
        res.render('user/userLogin', { title: 'login', txt });
        req.session.err = false; 
    } else {
        res.render('user/userLogin', { title: 'login' });
    }
}

 
const userSignup = (req,res)=>{
    const exist = req.session.exist
    res.render('user/userSignUp',{title:"SignuUp",exist})  
}


const getHome = async(req,res)=>{
    
    req.session.loggedIn = true;
    const name = req.session.name
    console.log(name)
    const loger = await userModel.find({name:name})
    const productModel = await products.find()
    // console.log("loger=====",loger)
    req.session.userId = loger[0]._id
    // console.log("req.session.userId=====",req.session.userId)
    
    res.render('user/userHome',{title:"Zoan Home",productModel,name})
    
}


const otpForm = (req,res)=>{
    // otp timer-----------------
    req.session.vaotp = controller.vaotp() 
    let time = new Date()
    // let time1 = new Date(time)
    // let diff = Math.floar((time-time1)/1000)
    console.log("signup otp ==",req.session.vaotp)
    const timer =  setTimeout(() => {
        req.session.vaotp = null
        req.session.Pw = null
        console.log("time up")
    }, 60000);
    if(req.session.errorOtp){
      var erro = req.session.errorOtp
      setTimeout(()=>{
        erro=""
      },60000)
    }

    res.render('user/otpRegister',{title:"Register",time,erro})
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//entering home--------------------
const postEnteringHOme = async(req,res)=>{
    let userOtp=req.body.number1
    const vaotp = req.session.vaotp
    console.log(vaotp)
    // console.log("What the hell is this ==== ",controller.otp)
    console.log(req.session.data)
    // const {name,email,password}=req.session.data;
    const name = req.session.name
    const email = req.session.email
    // const password = req.session.password
    // req.session.name = name


    const logins = await userModel.findOne({email:email})
    // if(newOtp!==undefined){
    //     setTimeout(async()=>{
    //         await otpModel.delete({})
    //         newOtp = undefined
    //     },60000)
    // }
    if(!logins){
      if(userOtp == vaotp||userOtp == req.session.Pw){
          const hashPass = await bcrypt.hash(req.session.password,saltRounds)
          req.session.userAuth = true;

          // await otpModel.delete()

          const logged=await userModel.create({name,email,password:hashPass});
          console.log(logged)

          const user = await userModel.findOne({email:email})

          req.session.userId = user._id
          res.redirect('/userHome')
      }else{
          // res.send('something went wrong')
          req.session.errorOtp = "enter valid otp"
          // // res.render('/signup',{text:"enter valid otp"})
          res.redirect('/otpsen')
      }
    }else{
    // res.render('/signup',{text:"email already exist"})
    // res.send('email already exists')
}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

const userLoginBackend = async(req,res)=>{
    const {email,password} = req.body;
    // console.log(email);
    
    const logins = await userModel.findOne({email: email})
    // console.log(logins)
    // console.log(logins)
    if(!logins){
        req.session.txt ="No users found"
        res.redirect('/login')
        // res.render('user/userLogin',{txt:"No users found",title: "Login"})
    }else{
        let isChecked = await bcrypt.compare(password,logins.password)
        
        req.session.name = logins.name
        // const check = await userModel.findOne({email:email},{access:1})
        // console.log(logins.access)
        if(isChecked == true && logins.access){
            req.session.userAuth = true; 
            req.session.email = email
            req.session.userId = logins._id
            console.log('userId='+req.session.userId)
            res.redirect('/userHome')
        }else if(logins.access == false){
            req.session.txt = "User is blocked"
            req.session.err = true
            res.redirect('/login')
            // res.render('user/userLogin',{txt:"User not found",title:"login"})
        }else if(isChecked == false){
            req.session.txt = "Check your password"
            req.session.err = true
            res.redirect('/login')
        }
    }
}

//user logout==================
const logout = (req,res)=>{
    
    req.session.destroy((err)=>{
        if (err) {
            console.log(err)
        } else {
            // res.setHeader('Cache-Control','no-store')
            res.redirect('/')
        }
    }
)}




//product list user-side
const productList1 = async(req,res)=>{
    const productsList = await products.find();
    const name = req.session.name

    res.render('user/product-list',{name,productsList,title:"Zoan List" });
}



//product detail user side

const producDetail = async(req,res)=>{
    const name = req.session.name
    const P_id = req.params.id
    console.log("Product id=",P_id)
    const P_detail = await products.findOne({_id: P_id})
    console.log(P_detail)


    
    res.render('user/product -page',{P_detail,name,title: 'Product Page'})
    
    
}






//forgot pass render====================
const forgotPass = (req,res)=>{
    res.render('user/forgotten_pass',{title:'forgotten password'})
}





//forgot otp
const forgotOtp = async(req,res)=>{
    const email = req.body.email
    const user = await userModel.findOne({email: email})
    req.session.email=email
    if(user==null){
        res.render('user/forgotten_pass',{title:'forgotten password',err:'user does not exist'})
    }else{
        res.redirect('/forgotPasswordOtpGenerate')
    }
    
    console.log(user);
}


//confirmation password render

const getConfirmPass = async(req,res)=>{
    // console.log("your email is = ",req.session.email)
    const data = await userModel.findOne({email: req.session.email})
    const hashPass = await bcrypt.hash(req.body.password,10)
    await userModel.updateOne({email: req.session.email},{password: hashPass})
    res.redirect('\login')
    }






//user-add-cart-========-=-----------------==============------------------======================-------------=

const userAddtoCart =  async (req, res) => {
    try {
      const userData = await userModel.findOne({ name: req.session.name });
      const productId = req.params.id;
      const userId = userData._id;
      console.log("lefcjpifcjpifjpifjepi",userId)
      const userExist = await cartModel.findOne({ userId: userId });
  const ProductId = new mongoose.Types.ObjectId(productId)
      if (!userExist) {
        // Create a new cart and associate it with the user
        const cart = await cartModel.create({
          userId: userId,
          Items: [{ ProductId: ProductId }]
        });
  
      } else {
        const product = await cartModel.findOne({userId: userId,'Items.ProductId':ProductId})
  
        console.log("foooooooo product check",product)
        // console.log(productId)
  
        if(!product){
  
          await cartModel.findByIdAndUpdate(userExist._id, {
            $push: {
              Items: { ProductId: ProductId }
            }
          });
  
        }else{
  
          await cartModel.findByIdAndUpdate({userId: userId,'Items.ProductId':ProductId},{$inc:{'Items.Quantity': 1}})
          .then(()=>{console.log('success')})
          .catch((err)=>{console.log(err)})
        }
      }
  
      res.redirect('/Product-list');
    } catch (error) {
      console.error("error=",error);
    }
  }

//user-getCart================

const userGetCart = async(req,res)=>{
    try {
  
      const name = req.session.name
      // console.log("username====",req.session.name);
      // console.log("session.userId====",req.session.userId);
      // console.log("heleleleooeloeo");
      const userId=new mongoose.Types.ObjectId(req.session.userId)
      // console.log("oiwejofj=====",userId);
      const cartDetail = await cartModel.findOne({userId: userId })
      .populate('Items.ProductId')
      // console.log("cart.Detail===",cartDetail);
  
  
      if(cartDetail){
  
        const carts=cartDetail.Items
        // console.log("carts = ",carts)   
        // console.log("carts.ProductId from /cart",carts.ProductId); 
        // let i=-1
        let sum=0
  
          carts.forEach(cart => {
            console.log("==========================================================")
            console.log("carts.cart=========================================================",cart)
            sum+=(cart.Quantity * cart.ProductId.Price)
          });
  
          const totalPrice = await  cartModel.updateOne({userId: userId}, {$set:{totalAmount: sum}})
  
        res.render('user/cart-page',{title:'My cart',name,cartDetail,sum})
  
      }else{
          res.render('user/no-cart',{title:'No item found',name})
      }
    } catch (error) {
  
      console.error(error);
  
    }
  }



//Quantity uupdation-cart

const cartQuantityUpdate = async(req,res)=>{
    console.log(req.body);
    const {inc,productId} = req.body
  
    // console.log("reached server updating.....")
    // console.log("server side number ==",number)
    // console.log("server side productId ==",productId)
  
    //product detail
    const product = await products.findOne({_id: productId})
    const userId=new mongoose.Types.ObjectId(req.session.userId)
    const productItem = new mongoose.Types.ObjectId(product._id)
    const cartDetail = await cartModel.findOne({userId: userId})
  
    //cart detail
    const cartItem = cartDetail.Items.find((item)=>{
      return item.ProductId.equals(productItem)
    })
  
    //total amount
    cartDetail.totalAmount += inc*product.Price
    // console.log("cartItem===",cartItem)
  
    //newQuandity
    const newQuantity = cartItem.Quantity+Number(inc)
  
    //cart Items price
    if(newQuantity>=1 && newQuantity <= product.Stock){
      cartItem.Price = newQuantity * product.Price
    
    //
    cartItem.Quantity = newQuantity
    cartDetail.save()
    }
    
  
    
  
  
    res.json(
      {
        success:true,
        Quantity:newQuantity,
        Stock:product.Stock,
        price:cartItem.Price,
        totalPrice: cartDetail.totalAmount
        
      }
      )
  
  }


//cart item deletion===========================================

const cartItemDeletion = async(req,res)=>{
    try {
      const ParentId = req.body.ParentId
      const cartId = req.params.cartId
      console.log("ParentId====",ParentId);
      console.log("cartId=====",cartId)
      // await cartModel.updateOne({_id:ParentId},{Items: {$pull: {_id:cartId}}})
      await cartModel.updateOne({_id: ParentId},{
        $pull:{
            Items:{_id: cartId}
        }
    })
      res.json({
        success:true,
        message:"Password Updated Successfully"
      })
  
  
    } catch (error) {
      
    }
  }







//get user profile

const getUserProfile = async(req,res)=>{
    const name=req.session.name
    const userData = await userModel.findOne({name:name})
    console.log("email==="+userData.email);
    // console.log("name===",name)
    res.render('user/userProfile',{name,userData,title:"Zoan | profile"})
  }







//update user info in profile

const updateUserProfile = async(req,res)=>{
    const userId = req.session.userId
    const {name, email, phoneNumber} = req.body
    const item = await userModel.findOne({_id:userId})
    let flag = 0
    if(!name){
      name = item.name
    }
    if(!email){
      email=item.email
    }
    if(!phoneNumber){
      if(!item.MobileNumber){
        await userModel.updateOne({_id:userId},{$set:{name:name,email:email}})
         flag = 1
  
      }else{
        phoneNumber = item.MobileNumber
      }
    }
    if(flag == 0){
      req.session.name = name
      req.session.email = email
    await userModel.updateOne({_id:userId},{$set:{name:name,email:email,MobileNumber:phoneNumber}})
    }
    res.redirect('/profile')
  }




//get Password Change

const passChange = (req,res)=>{
    const name = req.session.name
    res.render('user/userPasswordChenge',{title:"Zoan | Change Password",name})
  }
































module.exports = {
    userLogin,
    userSignup,
    getHome,
    otpForm,
    postEnteringHOme,
    userLoginBackend,
    logout,
    productList1,
    producDetail,
    forgotPass,
    forgotOtp,
    getConfirmPass,
    userAddtoCart,
    userGetCart,
    cartQuantityUpdate,
    cartItemDeletion,
    getUserProfile,
    updateUserProfile,
    passChange,

}