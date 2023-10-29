const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const otpGenerator = require('otp-generator')
const nodemailer = require('nodemailer')
const Mailgen = require('mailgen')
const mongoose  = require('mongoose')
const us = require('../controllers/UserControll/user-side')
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

//-------------------------------------------------------------------------------------------------------------------------------------
//checking for already existing user while registering
// router.post ('/checkUser',(req,res)=>{



//     res.redirect('/otpsend')
// })
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




router.get('/logout',(req,res)=>{
    
    req.session.destroy((err)=>{
        if (err) {
            console.log(err)
        } else {
            // res.setHeader('Cache-Control','no-store')
            res.redirect('/')
        }
    })
    
})
// res.redirect('/');

//--------------------------------------------------------------------------------------------------------------------------------------------------------------//
//product-list userside---------------------------------------------------------------------------------

router.get('/Product-list',authGuard.userLoginAuthGuard, userAccess, async(req,res)=>{
    const productsList = await products.find();
    const name = req.session.name

    res.render('user/product-list',{name,productsList,title:"Zoan List" });
})
//------------------------------------------------------------------------------------------------------------------------------------------



//============================================================================================================================================

//product detail page

router.route('/productDetail/:id',authGuard.userLoginAuthGuard,userAccess)
.get(async(req,res)=>{
        const name = req.session.name
        const P_id = req.params.id
        console.log("Product id=",P_id)
        const P_detail = await products.findOne({_id: P_id})
        console.log(P_detail)


        
        res.render('user/product -page',{P_detail,name,title: 'Product Page'})
        
        
    })
//------------------------------------------------------------------------------------------------------------------------
  
  
    //user forgot password
router.route('/forgotPassword',authGuard.userLoggedinAuthGuard)
    .get((req,res)=>{
        res.render('user/forgotten_pass',{title:'forgotten password'})
    })
    //forgotten otp================
    
router.post('/forgottenOtp',async(req,res)=>{
    const email = req.body.email
    const user = await userModel.findOne({email: email})
    req.session.email=email
    if(user==null){
        res.render('user/forgotten_pass',{title:'forgotten password',err:'user does not exist'})
    }else{
        res.redirect('/forgotPasswordOtpGenerate')
    }
    
    console.log(user);
})

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

router.post('/confirmation-pass',async(req,res)=>{
// console.log("your email is = ",req.session.email)
const data = await userModel.findOne({email: req.session.email})
const hashPass = await bcrypt.hash(req.body.password,10)
await userModel.updateOne({email: req.session.email},{password: hashPass})
res.redirect('\login')
})
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
router.get('/addToCart/:id', async (req, res) => {
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
});










//============================================
//user cart

router.get('/cart',authGuard.userLoginAuthGuard,async(req,res)=>{
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
      console.log("carts = ",carts)   
      console.log("carts.ProductId from /cart",carts.ProductId); 
      // let i=-1
      let sum=0

        carts.forEach(cart => {
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
})
//====================================================
//=========================================================
//cart quandity updation

  router.post('/updateCartValue',async(req,res)=>{
  console.log(req.body);
  const {number,productId} = req.body

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
  cartDetail.totalAmount += number*product.Price
  // console.log("cartItem===",cartItem)

  //newQuandity
  const newQuantity = cartItem.Quantity+Number(number)

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

})


//cart item deletion


router.put('/deleteCartItem/:cartId',async(req,res)=>{
  try {
    const ParentId = req.body.ParentId
    const cartId = req.params.cartId
    console.log("ParentId====",ParentId);
    console.log("cartId=====",cartId)
    // await cartModel.updateOne({_id:ParentId},{Items: {$pull: {_id:cartId}}})

    res.json({
      success:true
    })


  } catch (error) {
    
  }
})







































//=============================================================================================================
//user profile========================================

router.get('/profile',async(req,res)=>{
  const name=req.session.name
  const userData = await userModel.findOne({name:name})
  console.log("email==="+userData.email);
  // console.log("name===",name)
  res.render('user/userProfile',{name,userData,title:"Zoan | profile"})
})


//user profile update=================================

router.post('/updateInfo',async(req,res)=>{
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
})
//=============================================================================================
//password change
router.get('/changePassword',(req,res)=>{
  const name = req.session.name
  res.render('user/userPasswordChenge',{title:"Zoan | Change Password",name})
})

//password Check
router.post('/checkPasswords',async(req,res)=>{



//checking validator
  // const Pass = req.body.Pass
  // const ar = []
  // await pValidator.validate(Pass,{details:true}).forEach((x)=>{
  //    ar[x]=x.message
  //    console.log(x.message)
  // })
  // console.log("ar.length===",ar.length);
  
  
  
  
  
  
  res.json({
  success:true
  })
  
})






























module.exports = router 