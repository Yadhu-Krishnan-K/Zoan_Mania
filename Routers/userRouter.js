const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')
const mongoose  = require('mongoose')
const moment = require('moment')


const us = require('../controllers/UserControll/user-side')
const orderModel = require('../models/order')
const userModel = require('../models/user')
const authGuard = require('../middlewares/authGuard')
const productInHome = require('../controllers/UserControll/home-page-products')
const controller = require('../util/for-otp')
const products = require('../models/products')
const Fotp = require('../util/forgotPassword')
const userAccess = require('../middlewares/userSession')
const cartModel = require('../models/cartModel')
const pValidator = require('../util/passwordValidator')


router.get('/',authGuard.userLoggedinAuthGuard,(req,res)=>{

    res.render('user/anonymous',{productInHome})
})
 

//user login-------------------------------------------------------------------------
router.get('/login',authGuard.userLoggedinAuthGuard,us.userLogin);

//user signup----------------------------------------------------------------------------------
router.get('/signup',authGuard.userLoggedinAuthGuard,us.userSignup)

//--------------------------------------------------------------------------------------------------------------------------//
//userHome


router.get('/userHome',authGuard.userLoginAuthGuard,userAccess,us.getHome)

//-------------------------------------------------------------------------------------------------------------------------------------------
//otp control---------------------------------------------------------

router.post('/otpsend',controller.otp);

//=----------==-----------------------=-------------------------------------=--------------------------------------------------------------------
//otp form--------

router.get('/otpsen',authGuard.userLoggedinAuthGuard,us.otpForm)
 
//--------------------------------------------------------------------------------------------------
//entering to home route --------------------===------------------=--------

router.post('/home',us.postEnteringHOme)

//====-----------------------------------------------------------------------------------------------------

//userloginbackend==---------------------------------------------------------------//-----------------------------------------------------------

router.post('/homed',us.userLoginBackend)

//----------------------------------------------------------------------------------------------------------------------------------------------------//
//logout




router.get('/logout',us.logout)
    
// res.redirect('/');

//--------------------------------------------------------------------------------------------------------------------------------------------------------------//
//product-list userside---------------------------------------------------------------------------------

router.get('/Product-list',authGuard.userLoginAuthGuard, userAccess, us.productList1)
//------------------------------------------------------------------------------------------------------------------------------------------


 
//============================================================================================================================================

//product detail page

router.route('/productDetail/:id',authGuard.userLoginAuthGuard,userAccess)
.get(us.producDetail)
//------------------------------------------------------------------------------------------------------------------------
  
  
    //user forgot password
router.route('/forgotPassword',authGuard.userLoggedinAuthGuard)
    .get(us.forgotPass)
    //forgotten otp================
    
router.post('/forgottenOtp',us.forgotOtp)

//---------------------------------------------------------------------------------------------------------------------------------
//otpGenerate
router.get('/forgotPasswordOtpGenerate',Fotp.Otp)

//otpForm
router.get('/updatePassword-1',(req,res)=>{
    console.log(Fotp.vaOtp)
    res.render('user/otpFormForPC')
})

router.post('/FotpSmt',async(req,res)=>{
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
    
})

//------password confirm
router.get('/pwConfirm',(req,res)=>{
    res.render('user/ConfirmPassword',{title:"Confirm Password"});
})

router.post('/confirmation-pass',us.getConfirmPass)
//===================================================================================================================
//resend otp
router.get('/resendOtp',async(req,res)=>{

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

})

//==================================================================================================================================
//===========================================================================================================================
//add to cart
router.get('/addToCart/:id',us.userAddtoCart);










//============================================
//user cart
router.get('/cart',authGuard.userLoginAuthGuard,us.userGetCart)

//cart quandity updation
router.post('/updateCartValue',us.cartQuantityUpdate)

//cart item deletion
router.put('/deleteCartItem/:cartId',us.cartItemDeletion)



//=============================================================================================================




//user profile========================================
router.get('/profile',us.getUserProfile)

//user profile update=================================
router.post('/updateInfo',us.updateUserProfile)




//=============================================================================================



//password change
router.get('/changePassword',us.passChange)

//password Check
router.post('/checkPasswords',async(req,res)=>{
console.log("inside check password")
// checking validator
  const Pass = req.body.Pass
 
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
    res.status(400).json({ 
      errors: errorMessage
     });
  }


  // console.log("ar.length===",ar.length);
  
  
})


//Manage  Address

router.get('/manageAddress',async(req,res)=>{

  const userData = await userModel.findOne({_id:req.session.userId})
//  console.log("userdataaa",userData);
  const name = req.session.name
  
  res.render('user/userAddress',{title:"Zoan | Address",name, userData})
})


//user Address add

router.post('/saveAddress',async(req,res)=>{
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

})



// customer update address===============


router.post('/updateAddress/:userId',async(req,res)=>{
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
})

//delete address

router.get('/deleteAddress/:userId/:addresId',async(req,res)=>{
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
})


//=====================================================================================================================================================
//================================================
//user checkout
router.get('/buyTheProducts',async (req, res)=>{
  const name = req.session.name
  const userData= await userModel.findOne({name:name})
  // console.log("fdff",userData);
  res.render('user/userCheckout',{title:"Zoan | Checkout",userData,name})
  
}
)


//order confirmation page======================================================
router.post('/placeOrder',async(req,res)=>{
  // const name = req.session.name
  console.log("userId==",req.session.userId)
  const email = req.session.email;
  console.log("req.session=============================================345594--------------==============",req.session)
  console.log("cart 1=" + email);
  let datas = req.body;
  console.log(datas);
  const Address = req.body.selectedAddress;
  console.log("Addrss=====",Address)
  const paymentMethod = req.body.selectedPayment;
  const amount = req.session.totalPrice;
  console.log(amount);

  try {
      const userData = await userModel.findOne({ email: email });
      console.log(userData);
      
      if (!userData) {
          console.log("cart data note available");

          return;
      }

      const userID = userData._id;
      console.log("order time user id ",userID);

      const cartData = await cartModel.findOne({ userId: userID }).populate("Items.ProductId");
      console.log("cartData",cartData);

      if (!cartData) {
          console.log("Cart data not available");
          // res.render("errorView/404admin");
          return;
      }

      const addressNew = await userModel.findOne({
          _id:userID,
          address:{$elemMatch:{_id: new mongoose.Types.ObjectId(Address)}}
      })
      console.log("address 0001:",addressNew); 

      const add = {
          Name: addressNew.address[0].Name,
          Address:  addressNew.address[0].AddressLine,
          Pincode: addressNew.address[0].Pincode,
          City: addressNew.address[0].City,
          State: addressNew.address[0].State,
          Mobile:  addressNew.address[0].Mobile,
      }

      console.log(add);

      const newOrder = new orderModel({
          UserId: userID,
          Items: cartData.products,
          PaymentMethod: paymentMethod,
          OrderDate: moment(new Date()).format("llll"),
          ExpectedDeliveryDate: moment().add(4, "days").format("llll"),
          TotalPrice: amount,
          Address: add,
      });


      const order = await newOrder.save();
      req.session.orderID = order._id;
      console.log("Order detail", order);
      await cartModel.findByIdAndDelete(cartData._id);

      for (const item of order.Items) {
          const productId = item.productId;
          const quantity = item.quantity;
          const product = await products.findById(productId);

          if (product) {
              const updateQuantity = products.Stock - quantity;
              if (updateQuantity < 0) {
                  product.Stock = 0;
                  product.Status = "Out of stock";
              } else {
                  product.Stock = updateQuantity;
                  await product.save();
              }
          }
      }
//just redired if code to some route
      if (paymentMethod === "cod") {
          res.redirect('/placeOrder');
      }
  } catch (error) {
      console.error("An error occurred:", error);
      console.log("cart data note available 01--");
      // res.render("errorView/404");
  }
  // res.render('user/userOrderConfirm',{title:"Order Confirmed",name})
})

router.get('/placeOrder',(req,res)=>{
  let name = req.session.name
  res.render('user/userOrderConfirm',{name, title:"Confirmed oreder"})
})






























module.exports = router 


































