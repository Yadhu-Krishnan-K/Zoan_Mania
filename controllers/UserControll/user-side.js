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
const Categories = require('../../models/category')

const controller = require('../../util/for-otp')
// require('razorpay/dist/types/items')


  

//userlogin
const userLogin = (req, res) => {
  try {
    
    let txt = req.session.txt;
    if (req.session.err) {
        res.render('user/userLogin', { title: 'login', txt });
        req.session.err = false; 
    } else {
        res.render('user/userLogin', { title: 'login' });
    }
    
  } catch (error) {
    console.error("error 500 :",error);
  }
  
}

 
const userSignup = (req,res)=>{
  try {
    
    const exist = req.session.exist
    res.render('user/userSignUp',{title:"SignuUp",exist})  
    
  } catch (error) {
    console.error("error 500 :",error);
  }
  
} 


const getHome =async (req, res) => {
  try {
    req.session.loggedIn = true;
    const name = req.session.name;
    const loger = await userModel.findOne({ name: name });
    const userId = loger._id;
    req.session.userId = userId;

    const productModel = await products.find().sort({ Selled: -1 }).limit(8);

    const cartData = await cartModel.findOne({ userId: userId }).populate('userId');
    let cartcount = 0;

    if (cartData === null || cartData.Items == (null || 0)) {
      cartcount = 0;
    } else {
      cartData.Items.forEach((cart) => {
        cartcount += cart.Quantity;
      });
    }
    const catWithOffer = 

    await cartModel.updateOne({ userId: userId }, { $set: { totalQuantity: cartcount } });

    res.render('user/userHome', { title: 'Zoan Home', productModel, name, cartData, cartcount });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
} 


const otpForm = (req,res)=>{
  try {
    
    req.session.vaotp = controller.vaotp() 
    let time = new Date()
   
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
  
    // res.render('user/otpRegister',{title:"Register",time,erro})
    
  } catch (error) {
    console.error("error 500 :",error);
  }
  
    
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
//entering home--------------------

const postEnteringHOme = async(req, res) => {
  try {
      let userOtp = req.body.number1;
      const vaotp = req.session.vaotp;
      console.log(vaotp);
      console.log(req.session.data);
      const name = req.session.name;
      const email = req.session.email;
     
      const logins = await userModel.findOne({ email: email });

      if (!logins) {
          if (userOtp == vaotp || userOtp == req.session.Pw) {
              const hashPass = await bcrypt.hash(req.session.password, saltRounds);
              req.session.userAuth = true;

              const logged = await userModel.create({ name, email, password: hashPass });
              console.log(logged);

              const user = await userModel.findOne({ email: email });

              req.session.userId = user._id;
              res.json({ success: true});
          } else {
              // req.session.errorOtp = "enter valid otp";
              res.json({ success: false, message: "Enter valid OTP" });
          }
      } else {
          // Handle if user already exists
      }
  } catch (error) {
      console.error("error 500 :", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// module.exports = { postEnteringHome };

//////////////////////////////////////////////////////////home////////////////////////////////////////////////

const userLoginBackend = async(req,res)=>{
  try {
    
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
    
  } catch (error) {
    console.error("error 500 :",error);
  }
  
}

//user logout==================
const logout = (req,res)=>{
  try {
    
    req.session.userAuth = false
    req.session.loggedIn = false
  
    res.redirect('/')
    
  } catch (error) {
    console.error("error 500 :",error);
  }
  
    
        
}




const searchOptions = async(req,res)=>{
  try {
    
    let value = req.body.value
    let categories = await Categories.find()
    const listCount = await products.find({
      Name:{$regex: "^"+value, $options: "i"}
    }).count()
  
    let name = req.session.name
    const cartData = await cartModel.findOne({userId:req.session.userId})
      let cartcount = 0
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
      const productsList = await products.find({$or:[
        {Name:{$regex: "^"+value, $options: "i"}},
        {Category:{$regex: "^"+value, $options: "i"}} 
      ]}).sort({_id: -1})
    .skip((page-1)*perPage)
    .limit(perPage)
    
    
    res.render('user/product-list',{
      productsList,categories,name, title:'Product List',cartcount,cartData, pageNums,currentPage
    })
    
  } catch (error) {
    console.error("error 500 :",error);
  }
  
}














//product list user-side==============
const productList1 = async(req,res)=>{
  try {
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
    
    
  } catch (error) {
    console.error("error 500 :",error);
  }
  


}



//product detail user side

const producDetail = async(req,res)=>{
  try {
    
    const name = req.session.name
    const P_id = req.params.id
    const userId = req.session.userId
    console.log("Product id=",P_id)
    const P_detail = await products.findOne({_id: P_id})
    console.log(P_detail)
    const cartData = await cartModel.findOne({userId:userId}).populate('Items.ProductId')
  
  
    let check = 0
  
    if (cartData && cartData.Items.length > 0) {
      for (let i = 0; i < cartData.Items.length; i++) {
        const productId = cartData.Items[i].ProductId;
        if (productId._id === P_id) {
          // Product ID found in the cart data
          check = true
        }
      }
    }
    
    // Product ID not found in the cart data
    if(check == 0){
    check =  false;}
    
    let cartcount = 0
    if (cartData === null || cartData.Items == (null||0)) {
      
      cartcount = 0
  
    }else{
    cartData.Items.forEach((cart)=>{
      cartcount += cart.Quantity
    })
  }
  
    res.render('user/product-page',{P_detail,check,name,cartcount,cartData,title: 'Product Page'})
    
    
    
  } catch (error) {
    console.error("error 500 :",error);
  }
  
}






//forgot pass render====================
const forgotPass = (req,res)=>{
  try {
    
    res.render('user/forgotten_pass',{title:'forgotten password'})
    
  } catch (error) {
    console.error("error 500 :",error);
  }
  
}





//forgot otp
const forgotOtp = async(req,res)=>{
  try {
    
    const email = req.body.email
    const user = await userModel.findOne({email: email})
    req.session.email=email
    
    if(user==null){
        res.render('user/forgotten_pass',{title:'forgotten password',err:'user does not exist'})
    }else{
        res.redirect('/forgotPasswordOtpGenerate')
    }
    
    console.log(user);
    
  } catch (error) {
    console.error("error 500 :",error);
  }
  
}


//confirmation password render

const getConfirmPass = async(req,res)=>{
  try {
    
    const data = await userModel.findOne({email: req.session.email})
    const hashPass = await bcrypt.hash(req.body.password,10)
    await userModel.updateOne({email: req.session.email},{password: hashPass})
    res.redirect('\login')
    
  } catch (error) {
    console.error("error 500 :",error);
  }
  
    }






//user-add-cart-========-=-----------------==============------------------======================-------------=

// const userAddtoCart =  async (req, res) => {
//     try {
//       const userData = await userModel.findOne({ name: req.session.name });
//       const productId = req.params.id;
//       const userId = userData._id || req.session.userId;
//       const userExist = await cartModel.findOne({ userId: userId });
//       const ProductId = new mongoose.Types.ObjectId(productId)
//       if (!userExist) {

//         const cart = await cartModel.create({
//           userId: userId,
//           Items: [{ ProductId: ProductId }]
//         });
  
//       } else {
//         const product = await cartModel.findOne({userId: userId,'Items.ProductId':ProductId})

//         if(!product){
  
//           await cartModel.findByIdAndUpdate(userExist._id, {
//             $push: {
//               Items: { ProductId: ProductId }
//             }
//           });
  
//         }else{
  
//           await cartModel.findByIdAndUpdate({userId: userId,'Items.ProductId':ProductId},{$inc:{'Items.Quantity': 1}})
//           .then(()=>{console.log('success')})
//           .catch((err)=>{console.log(err)})
//         }
//       }
  
//       // res.redirect('/Product-list');
//       res.json({
//         success:true
//       })
//     } catch (error) {
//       console.error("error=",error);
//     }
//   }
const userAddtoCart = async (req, res) => {
  try {
    const userData = await userModel.findOne({ name: req.session.name });
    const productId = req.params.id;
    const userId = userData._id || req.session.userId;
    const userExist = await cartModel.findOne({ userId: userId });
    const ProductId = new mongoose.Types.ObjectId(productId);

    // Assuming you have a products model with a field 'catOffer'
    const productDetails = await products.findById(ProductId);

    let discount = 0;

    // Check if the product has a catOffer
    if (productDetails.catOffer) {
      // Apply the discount logic based on your requirements
      discount = productDetails.catOffer.catPer /100; // 10% discount for demonstration purposes, adjust as needed
    }

    const cartItem = {
      ProductId: ProductId,
      Quantity: 1,
      Price: productDetails.Price, // You may want to consider the discounted price here
      discounted: productDetails.Price * discount,
    };

    if (!userExist) {
      const cart = await cartModel.create({
        userId: userId,
        Items: [cartItem],
        totalAmount: cartItem.Price - cartItem.discounted,
        totalQuantity: cartItem.Quantity,
      });
    } else {
      const existingProduct = await cartModel.findOne({
        userId: userId,
        'Items.ProductId': ProductId,
      });

      if (!existingProduct) {
        await cartModel.findByIdAndUpdate(userExist._id, {
          $push: {
            Items: cartItem,
          },
          $inc: {
            totalAmount: cartItem.Price - cartItem.discounted,
            totalQuantity: cartItem.Quantity,
          },
        });
      } else {
        await cartModel.updateOne(
          { userId: userId, 'Items.ProductId': ProductId },
          {
            $inc: {
              'Items.$.Quantity': 1,
              totalAmount: cartItem.Price - cartItem.discounted,
              totalQuantity: cartItem.Quantity,
            },
          }
        );
      }
    }

    res.json({
      success: true,
    });
  } catch (error) {
    console.error("error=", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};


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
        console.log("carts==",carts)

          carts.forEach(cart => {
            // console.log(cart.ProductId.Price)
            sum+=(cart.Quantity * cart.ProductId.discountedPrice)
          });
          console.log("cartcount when entering cartpage====",cartcount)
          req.session.totalAmount = sum;
          const totalPrice = await  cartModel.updateOne({userId: userId}, {$set:{totalAmount: sum}})
  
        res.render('user/cart-page',{title:'My cart',name,cartDetail,sum,cartcount})
  
      }else{
          res.render('user/cart-page',{title:'No item found',cartDetail,name,cartcount})
      }
    } catch (error) {
  
      console.error("error 500:",error);
  
  }
}



//Quantity uupdation-cart

// const cartQuantityUpdate = async(req,res)=>{
//   try {
    
//     console.log(req.body);
//     const {inc,productId} = req.body
  
//     //product detail
//     const product = await products.findOne({_id: productId})
//     const userId=new mongoose.Types.ObjectId(req.session.userId)
//     const productItem = new mongoose.Types.ObjectId(product._id)
//     const cartDetail = await cartModel.findOne({userId: userId})
//     console.log("cartDetail===",cartDetail)
//     //cart detail
//     const cartItem = cartDetail.Items.find((item)=>{
//       return item.ProductId.equals(productItem)
//     })
  
//     //total amount
//     cartDetail.totalAmount += Number(inc)*product.Price
//     req.session.totalAmount = cartDetail.totalAmount
//     //newQuandity
//     const newQuantity = cartItem.Quantity+Number(inc)
    
//     //cart Items price
//     if(newQuantity>=1 && newQuantity <= product.Stock){
//       cartDetail.totalQuantity += Number(inc)
//       cartItem.Price = newQuantity * product.Price
    
//     //
//     cartItem.Quantity = newQuantity
//     cartDetail.save()
//     }
    
  
    
  
  
//     res.json(
//       {
//         success:true,
//         Quantity:newQuantity,
//         Stock:product.Stock,
//         price:cartItem.Price,
//         totalPrice: cartDetail.totalAmount,
//         totalQuantity: cartDetail.totalQuantity
//       }
//       )
    
//   } catch (error) {
//     console.error("error 500 :",error);
//   }
  
  
//   }
const cartQuantityUpdate = async (req, res) => {
  try {
    const { inc, productId } = req.body;

    // Product detail
    const product = await products.findOne({ _id: productId });
    const userId = new mongoose.Types.ObjectId(req.session.userId);
    const productItem = new mongoose.Types.ObjectId(product._id);
    const cartDetail = await cartModel.findOne({ userId: userId })
    .populate('Items.ProductId');

    // Cart detail
    const cartItem = cartDetail.Items.find((item) => {
      return item.ProductId._id.equals(productItem);
    });

    // Calculate discounted price
    const catOffer = product.catOffer;
    const discountAmount = (product.Price * catOffer.catPer) / 100;
    const discountedPrice = product.Price - discountAmount;

    // Update total amount
    cartDetail.totalAmount += Number(inc) * discountedPrice;
    req.session.totalAmount = cartDetail.totalAmount;

    // New quantity
    const newQuantity = cartItem.Quantity + Number(inc);

    // Update cart item price with discounted price
    if (newQuantity >= 1 && newQuantity <= product.Stock) {
      cartDetail.totalQuantity += Number(inc);
      cartItem.Price = newQuantity * discountedPrice;

      // Update cart item quantity
      cartItem.Quantity = newQuantity;

      // Save cart details
      cartDetail.save();
    }
    let realPrice = cartItem.Price * newQuantity
    res.json({
      success: true,
      Quantity: newQuantity,
      Stock: product.Stock,
      price: cartItem.Price,
      totalPrice: cartDetail.totalAmount,
      totalQuantity: cartDetail.totalQuantity,
      realPrice
    });
  } catch (error) {
    console.error("error 500:", error);
  }
};

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
      console.error("error 500: ",error); 
    }
  }







//get user profile

const getUserProfile = async(req,res)=>{
  try {
    
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
    
  } catch (error) {
    console.error("error 500 :",error);
  }
  
  }







//update user info in profile

const updateUserProfile = async(req,res)=>{
  try {
    
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
    
  } catch (error) {
    console.error("error 500 :",error);
  }
  
  }




//get Password Change
const passChange = async(req,res)=>{
  try {
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
    
    
  } catch (error) {
    console.error("error 500 :",error);
  }
  
  }


//otp-section for password change 
const passwordChange = (req,res)=>{
  try {
    
    console.log(Fotp.vaOtp)
    res.render('user/otpFormForPC')
    
  } catch (error) {
    console.error("error 500 :",error);
  }
  
}

//otp password check
const PassChecker = async(req,res)=>{
  try {
    
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
    
  } catch (error) {
    console.error("error 500 :",error);
  }
  
  // console.log(otp)
}


//password change otp send
const pwSendOtp=async(req,res)=>{
  try {
    
    const reOtp=otpGenerator.generate(4, { digits: true, specialChars: false, lowerCaseAlphabets: false, upperCaseAlphabets: false })
    req.session.Pw = reOtp
    console.log("resented OTP === ",reOtp)
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
    
      //  res.redirect('/otpsen')
      res.json({Resented:true})
    
  } catch (error) {
    console.error("error 500 :",error);
  }
  

  
  }


//password change
const passwordChange2 = async(req,res)=>{
  try {
    
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
        res.json({ 
          success:false,
          errMsg:true,
          errors: errorMessage
         });
      }
    
    
  } catch (error) {
    console.error("error 500 :",error);
  }
  
  
    // console.log("ar.length===",ar.length);
  }

  //render manage address
  const renderManageAddress=async(req,res)=>{
    try {
      
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
    
    } catch (error) {
      console.error("error 500 :",error);
    }
    
  }


  //add address
  const addAddress = async(req,res)=>{
    try {
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
  
    } catch (error) {
      console.log("500 error  :",error)
    }
  }
//customer update Address

const updateAddress = async(req,res)=>{
  try {
    
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
    
  } catch (error) {
    console.error("error 500 :",error);
  }
  
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
  try {
    
    const name = req.session.name
    const userId = req.session.userId
    const userData= await userModel.findOne({name:name})
    const cartData = await cartModel.findOne({userId:userId})
    if(cartData){
      var cartcount = 0
      cartData.Items.forEach((cart)=>{
        cartcount += cart.Quantity
      })
    res.render('user/userCheckout',{title:"Zoan | Checkout",userData,name,cartcount,cartData})
    }else{
      res.redirect('/userHome')
    }
    
  } catch (error) {
    console.error("error 500 :",error);
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
    checkoutUser,
    searchOptions
}