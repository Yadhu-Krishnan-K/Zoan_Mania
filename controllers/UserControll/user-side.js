const mongoose = require('mongoose')
const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')
const bcrypt = require('bcrypt')

// const { password } = require('../../util/passwordValidator')
//c//onst products = require('../../models/products')
const saltRounds = 10
const Fotp = require('../../util/forgotPassword')
const pValidator = require('../../util/passwordValidator')
const userModel = require('../../models/user')
// const productInHome = require('./home-page-products')
const products = require('../../models/products')
const cartModel = require('../../models/cartModel')
const category = require('../../models/category')
const controller = require('../../util/for-otp')


  

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
    const loger = await userModel.findOne({name:name})
    const userId = loger._id
    console.log("userId====",userId)
    req.session.userId = userId
    // const Pcount = await products.find().count()

    // const page = Number(req.query.page) || 1
    // const currentPage = page
    // const pageNums = Math.ceil(Pcount/8)
    const productModel = await products.find().sort({Selled: -1}).limit(8)
   
    const cartData = await cartModel.findOne({userId:userId}).populate('userId')
    let cartcount = 0
    if (cartData === null || cartData.Items == (null||0)) {
      
      cartcount = 0

    }else{
    cartData.Items.forEach((cart)=>{
      cartcount += cart.Quantity
    })
    }
    await cartModel.updateOne({userId:userId},{$set:{totalQuantity:cartcount}})
    // console.log("cartcount=====",cartcount)
    // console.log("cartData====",cartData);
    
    res.render('user/userHome',{title:"Zoan Home",productModel,name,cartData,cartcount})
    
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

}
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////

const userLoginBackend = async(req,res)=>{
    const {email,password} = req.body;
    console.log('email===',email,"    passord===",password);
    const logins = await userModel.findOne({email: email})

    if(!logins){
        req.session.txt ="No users found"
        res.json({
          success:false,
          err:"No users found"
        })
    }else{
        let isChecked = await bcrypt.compare(password,logins.password)
        
        req.session.name = logins.name
   
        if(isChecked == true && logins.access){
            req.session.userAuth = true; 
            req.session.email = email
            req.session.userId = logins._id
            req.session.save()
            console.log('userId='+req.session.userId)
            res.json({
              success:true
            })
        }else if(logins.access === false){
           
            res.json({
              success:false,
              err:"User is blocked"
            })
        }else if(isChecked === false){
           
            res.json({
              success:false,
              err:"Check your password"
            })
        }
    }
}

//user logout==================
const logout = (req,res)=>{
    
            req.session.userAuth = false
            req.session.loggedIn = false
        
            res.redirect('/')
        
}




//product list user-side==============
const productList1 = async(req,res)=>{

    const listCount = await products.find().count()
    const name = req.session.name
    const userId = req.session.userId
    const cartData = await cartModel.findOne({userId:userId}).populate('Items.ProductId')
    let cartcount = 0
    let categories = await category.find()
    console.log("cartData====",cartData);
    if (cartData === null || cartData.Items == (null||0)) {
      
      cartcount = 0
      
    }else{
      cartData.Items.forEach((cart)=>{
        cartcount += cart.Quantity
      })
    }
    
    let page = Number(req.query.page) || 1;
    let perPage = 8
    let pageNums = Math.ceil(listCount/perPage)
    let currentPage = page;
  const productsList = await products.find().sort({_id: -1})
  .skip((page-1)*perPage)
  .limit(perPage)
  
  res.render('user/product-list',{name,productsList,title:"Zoan List",cartData,cartcount,pageNums,listCount,page,currentPage,categories});

}



//product detail user side

const producDetail = async(req,res)=>{
    const name = req.session.name
    const P_id = req.params.id
    const userId = req.session.userId
    console.log("Product id=",P_id)
    const P_detail = await products.findOne({_id: P_id})
    console.log(P_detail)
    const cartData = await cartModel.findOne({userId:userId}).populate('Items.ProductId')
    let cartcount = 0
    if (cartData === null || cartData.Items == (null||0)) {
      
      cartcount = 0

    }else{
    cartData.Items.forEach((cart)=>{
      cartcount += cart.Quantity
    
    })
  }

    
    res.render('user/product-page',{P_detail,name,cartcount,title: 'Product Page'})
    
    
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
      const userExist = await cartModel.findOne({ userId: userId });
      const ProductId = new mongoose.Types.ObjectId(productId)
      if (!userExist) {

        const cart = await cartModel.create({
          userId: userId,
          Items: [{ ProductId: ProductId }]
        });
  
      } else {
        const product = await cartModel.findOne({userId: userId,'Items.ProductId':ProductId})

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
  
      // res.redirect('/Product-list');
      res.json({
        success:true
      })
    } catch (error) {
      console.error("error=",error);
    }
  }

//user-getCart================

const userGetCart = async(req,res)=>{
    try {
  
      const name = req.session.name
      const id = req.session.userId
      const userId=new mongoose.Types.ObjectId(req.session.userId)
      const cartDetail = await cartModel.findOne({userId: userId })
      .populate('Items.ProductId')

      let cartcount = 0
      const cartData = await cartModel.findOne({userId:id})
      if (cartData === null || cartData.Items == (null||0)) {
      
        cartcount = 0
  
      }else{
        cartData.Items.forEach((cart)=>{
          cartcount += cart.Quantity 
        })
      }
  
      if(cartDetail){
        
        const carts=cartDetail.Items
  
        let sum=0

          carts.forEach(cart => {
         
            sum+=(cart.Quantity * cart.ProductId.Price)
          });
          console.log("cartcount when entering cartpage====",cartcount)
          req.session.totalAmount = sum;
          const totalPrice = await  cartModel.updateOne({userId: userId}, {$set:{totalAmount: sum}})
  
        res.render('user/cart-page',{title:'My cart',name,cartDetail,sum,cartcount})
  
      }else{
          res.render('user/cart-page',{title:'No item found',cartDetail,name,cartcount})
      }
    } catch (error) {
  
      console.error(error);
  
    }
  }



//Quantity uupdation-cart

const cartQuantityUpdate = async(req,res)=>{
    console.log(req.body);
    const {inc,productId} = req.body
  
    //product detail
    const product = await products.findOne({_id: productId})
    const userId=new mongoose.Types.ObjectId(req.session.userId)
    const productItem = new mongoose.Types.ObjectId(product._id)
    const cartDetail = await cartModel.findOne({userId: userId})
    console.log("cartDetail===",cartDetail)
    //cart detail
    const cartItem = cartDetail.Items.find((item)=>{
      return item.ProductId.equals(productItem)
    })
  
    //total amount
    cartDetail.totalAmount += Number(inc)*product.Price
    req.session.totalAmount = cartDetail.totalAmount
    //newQuandity
    const newQuantity = cartItem.Quantity+Number(inc)
    
    //cart Items price
    if(newQuantity>=1 && newQuantity <= product.Stock){
      cartDetail.totalQuantity += Number(inc)
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
        totalPrice: cartDetail.totalAmount,
        totalQuantity: cartDetail.totalQuantity
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
    const userId = req.session.userId
    // req.session.save()
    const userData = await userModel.findOne({name:name})
    req.session.email = userData.email
    req.session.save()
    console.log("email==="+userData.email);
    const cartData = await cartModel.findOne({userId:userId})
    let cartcount = 0
    if (cartData === null || cartData.Items == (null||0)) {
      
      cartcount = 0

    }else{
    cartData.Items.forEach((cart)=>{
      cartcount += cart.Quantity
    
    })
  }
    // console.log("name===",name)
    res.render('user/userProfile',{name,userData,title:"Zoan | profile",cartcount})
  }







//update user info in profile

const updateUserProfile = async(req,res)=>{
    const userId = req.session.userId
    console.log("req.body===",req.body)
    const {name, email, phone} = req.body
    const item = await userModel.findOne({_id:userId})
    let flag = 0
    if(!name){
      name = item.name
    }
    if(!email){
      email=item.email
    }
    if(!phone){
      if(!item.MobileNumber){
        await userModel.updateOne({_id:userId},{$set:{name:name,email:email}})
         flag = 1
  
      }else{
        phone = item.MobileNumber
      }
    }
    if(flag == 0){
      req.session.name = name
      req.session.email = email
    await userModel.updateOne({_id:userId},{$set:{name:name,email:email,MobileNumber:phone}})
    }
    res.json({
      success:true,
    })
  }




//get Password Change
const passChange = async(req,res)=>{
    const name = req.session.name
    const userId = req.session.userId
    const cartData = await cartModel.findOne({userId:userId})
    let cartcount = 0
    if (cartData === null || cartData.Items == (null||0)) {
      
      cartcount = 0

    }else{
    cartData.Items.forEach((cart)=>{
      cartcount += cart.Quantity
    
    })
  }
    res.render('user/userPasswordChenge',{title:"Zoan | Change Password",name,cartcount})
  }


//otp-section for password change 
const passwordChange = (req,res)=>{
  console.log(Fotp.vaOtp)
  res.render('user/otpFormForPC')
}

//otp password check
const PassChecker = async(req,res)=>{
  let n1 = req.body.n1
  let n2 = req.body.n2
  let n3 = req.body.n3
  let n4 = req.body.n4
  let val = n1*1000+n2*100+n3*10+n4*1
  console.log(val)
  const otp = Fotp.vaOtp
  if(otp==val){
      res.redirect('/pwConfirm')
  }else{
      res.send('401 Unauthorised')
  }
  // console.log(otp)
}


//password change otp send
const pwSendOtp=async(req,res)=>{

  const reOtp=otpGenerator.generate(4, { digits: true, specialChars: false, lowerCaseAlphabets: false, upperCaseAlphabets: false })
  req.session.Pw = reOtp
  console.log(reOtp)
  const password = req.session.password
  const email = req.session.email
  
  // const datas = await userModel.findOne({email:email})
  const name = req.session.name;
  
  //    console.log(name)
  //     console.log(email)
  const data = {name,email,password}
  
  req.session.data = data
  //   const exist = await user.findOne({email})
     
       let config = {
         service : 'gmail',
         auth : {
           user:process.env.EMAIL,
           pass:process.env.PASSWORD
         }
       }
       
       let transporter = nodemailer.createTransport(config)
  
       let MailGenerator =new Mailgen({
         theme:"default",
         product:{
           name:"ZoanMania",
           link:'https://mailgen.js/'
         }
       })
       let response = {
         body:{
           name:name,
           intro:`Welcome back to ZOAN MANiA
           Password to enter Zoan_mania  "${reOtp}"`,
           outro:"Looking forward to do more business"
         }
  
       }
       let mail =MailGenerator.generate(response)
       let message = {
         from:process.env.email,
         to:email,
         subject:'OTP VARIFICATION',
         html:mail
       }
  
       
       transporter.sendMail(message).then(()=>{
         return res.status(201).json({
           msg:"you should receive an email"
         })
       }).catch(error => {
         return res.status(500)
       })
  
     res.redirect('/otpsen')
  
  }


//password change
const passwordChange2 = async(req,res)=>{
  console.log("inside check password")
  // checking validator
    const user = await userModel.findOne({_id:req.session.userId})
    const Pass = req.body.Pass
    const oldPass = req.body.oldPass
    bcrypt.compare(oldPass,user.password,(err,res)=>{
      if(err){
        res.json({
          success:false,
          notfound:true
        })
      }
    })
   
    const errors = pValidator.validate(Pass,{details:true})
  
    console.log("errors====",errors);
    if (errors.length === 0) {
      const hashPass = await bcrypt.hash(Pass,10)
      // res.status(200).json({ message: "Password is valid." });
      await userModel.updateOne({_id:req.session.userId},{$set:{password:hashPass}})
      res.json({
        success:true
        })
    }
    else {
      // Map error codes to user-friendly error messages
      const errorMessage = errors[0].message
     
      console.log("error:===",errorMessage);
      resjson({ 
        success:false,
        errors: errorMessage
       });
    }
  
  
    // console.log("ar.length===",ar.length);
  }

  //render manage address
  const renderManageAddress=async(req,res)=>{
    const userId = req.session.userId
    const userData = await userModel.findOne({_id:req.session.userId})
  //  console.log("userdataaa",userData);
    const name = req.session.name
    const cartData = await cartModel.findOne({userId:userId})
    let cartcount = 0
    if (cartData === null || cartData.Items == (null||0)) {
      
      cartcount = 0

    }else{
    cartData.Items.forEach((cart)=>{
      cartcount += cart.Quantity
    
    })
  }
    res.render('user/userAddress',{title:"Zoan | Address",name, userData,cartcount})
  }


  //add address
  const addAddress = async(req,res)=>{
    console.log("req.body==",req.body)
    const {Name,Address,City,Pincode,State,Mobile} = req.body;
    console.log("Name=",Name,
      "AddressLine=",Address,
      "City=",City,
      "Pincode=",Pincode,
      "State=",State,
      "Mobile=",Mobile)
  
    const addr = {
      Name:Name,
      AddressLine:Address,
      City:City,  
      Pincode:Pincode,
      State:State,
      Mobile:Mobile
    }
    await userModel.updateOne({_id:req.session.userId},{$push:{address: addr}})
    // const customer = await userModel.findOne({_id:req.session.userId})
    // console.log("custData=======",customer)
    // customer.addr.push()
    // customer.save()
    // res.redirect('/manageAddress ')
    console.log("reached success response")
    res.json({ success: true, message: "Address saved successfully" });
  
  }
//customer update Address

const updateAddress = async(req,res)=>{
  console.log("userId from updateAddress===",req.params.userId)
  const userId = req.params.userId;

  const {addressId,Name,Address,City,Pincode,State,Mobile} = req.body;
  console.log("AddressId====",addressId)
  const addr = {
    Name:Name,
    AddressLine:Address,
    City:City,
    Pincode:Pincode,
    State:State,
    Mobile:Mobile
  }
  const userData = await userModel.findOne({_id:userId})
  // console.log('ith userData======',userData)
  // await userModel.updateOne({_id:userId},{$set:{}})
  await userModel.findOneAndUpdate({'address._id':addressId},{$set: {'address.$':addr}})
  res.json({ success: true, message: "Address updated successfully" });
}

//delete address
const deleteAddress = async(req,res)=>{
  try {
   let userId = req.params.userId
   console.log("reached /delete address")
   
   let id = req.params.addresId
   console.log(id);
   const data = await userModel.findOne({ _id: userId })
   await userModel.updateOne({_id: data._id},{
       $pull:{
           address:{_id: id}
       }
   })
   console.log("delete:" + data);
   res.redirect('/manageAddress')
  } catch (error) {
   console.log(error)
  }
 }


//==============================================================================-----------------------------------------------------
//userCheckout
const checkoutUser = async (req, res)=>{
  const name = req.session.name
  const userId = req.session.userId
  const userData= await userModel.findOne({name:name})
  const cartData = await cartModel.findOne({userId:userId})
  if(cartData){
    var cartcount = 0
    cartData.Items.forEach((cart)=>{
      cartcount += cart.Quantity
    })
  res.render('user/userCheckout',{title:"Zoan | Checkout",userData,name,cartcount})
  }else{
    res.redirect('/userHome')
  }
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
    passwordChange,
    PassChecker,
    pwSendOtp,
    passwordChange2,
    renderManageAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    checkoutUser
}