require('dotenv').config()
const mongoose = require('mongoose')
const moment = require('moment')

const User = require('../../models/user')
const products = require('../../models/products')
const cartModel = require('../../models/cartModel')
const orderModel = require("../../models/order")
const { createOrder, expectedSignature } = require('../../backendHelpers/razorpay')


//userCheckout
const checkoutUser = async (req, res) => {
  try {
    const name = req.session.name
    const userId = req.session.userId
    const productId = req.params.productId || null
    console.log('product id from params = ',req.params)
    console.log('if validId = ',mongoose.Types.ObjectId.isValid(productId))
    const userData = await User.findOne({ name: name })
    const cartData = await cartModel.findOne({ userId: userId }) || null
    var cartcount = 0
    if (cartData) {
      cartData.Items.forEach((cart) => {
        cartcount += cart.Quantity
      })
        res.render('user/userCheckout', { title: "Zoan | Checkout", userData, name, cartcount })
    } else if(productId){
      res.render ('user/userCheckout', { title: "Zoan | Checkout", userData, name, cartcount })
    }else{
      res.redirect('/')
    }
  } catch (error) {
    console.log('Error: ',error.message)
  }
}



const orderSuccessPage = (req, res) => {
  try {
    
    let name = req.session.name
    let orderId = req.session.orderID
    req.session.visited++
  
    if (req.session.visited < 2) {
      res.render('user/orderSuccess', { name, title: "Oreder Confirmed", orderId })
    } else {
      res.redirect('/')
    }
  } catch (error) {
        console.log('Error: ',error.message)
  }
}



const placeOrder = async (req, res) => {
  console.log("Entered to place order");
  const email = req.session.email;

  const Address = req.body.selectedAddress;
  console.log("Selected Address====", Address)
  const paymentMethod = req.body.selectedPayment;
  const amount = req.session.totalAmount;

  try {
    const userData = await User.findOne({ email: email });

    if (!userData) {
      return;
    }

    const userID = userData._id;

    const cartData = await cartModel.findOne({ userId: userID });
    console.log("cartData====================----------------=================", cartData.Items);

    if (!cartData) {
      console.log("Cart data not available");
      return;
    }

    const addressNew = await User.findOne({
      _id: userID,
      address: { $elemMatch: { _id: new mongoose.Types.ObjectId(Address) } }
    })

    if (addressNew) {
      var addressObjIndex = addressNew.address.findIndex(addr => addr._id == Address)
    }



    const add = {
      Name: addressNew.address[addressObjIndex].Name,
      Address: addressNew.address[addressObjIndex].AddressLine,
      Pincode: addressNew.address[addressObjIndex].Pincode,
      City: addressNew.address[addressObjIndex].City,
      State: addressNew.address[addressObjIndex].State,
      Mobile: addressNew.address[addressObjIndex].Mobile
    }

    // console.log(add);


    const newOrder = new orderModel({
      UserId: userID,
      Items: cartData.Items.map(cartItem => ({
        productId: cartItem.ProductId, // Assuming this is the correct property name
        quantity: cartItem.Quantity,
      })),
      PaymentMethod: paymentMethod,
      OrderDate: moment(new Date()).format("llll"),
      ExpectedDeliveryDate: moment().add(4, "days").format("llll"),
      TotalPrice: amount,
      Address: add
    });
    // newOrder.email = email
    
    await cartModel.findByIdAndDelete(cartData._id);

    for (const item of newOrder.Items) {
      const productId = item.productId;
      const quantity = item.quantity;
      const product = await products.findById(productId);

      if (product) {
        const updateQuantity = product.Stock - quantity;
        product.Selled += quantity
        if (updateQuantity < 0) {
          product.Stock = 0;
          product.Status = "Out of stock";
        } else {
          product.Stock = updateQuantity;
          await product.save();
        }
      }
    }
    const order = await newOrder.save();
    req.session.orderID = order._id;
    req.session.visited = 0
    if (paymentMethod == 'cod') {
      console.log("inside payment method = cod and order model is creating")
      // console.log("Order detail", order);

      console.log("order response back");
      return res.json({ success: true, message: 'Order placed successfully' });
    } else if (paymentMethod == 'online') {

      const resOrder = await createOrder(amount)
      console.log('resOrder = ',resOrder)
      return res.json({ success: true, message: 'Order placed successfully',razorpayId:resOrder.id,order:newOrder, email });
    }
  } catch (error) {
    console.error("An error occurred:", error);
    console.log("cart data note available 01--");
  }
}



const verifyOrder = async (req, res) => {
  console.log('inside verifyORder')
  const {razorpay_order_id, razorpay_payment_id, razorpay_signature} = req.body

  try {
    
    const expSig = await expectedSignature(razorpay_order_id, razorpay_payment_id)
                
    if (expSig === razorpay_signature) {
      const email = req.session.email
      const userData = await User.findOne({ email: email });

    // ✅ Payment verified
    
    await cartModel.deleteOne({ userId: userData._id});
    console.log('verification success....')
    return res.json({ success: true, message: "Payment verified successfully" });
  } else {
    await orderModel.deleteOne({UserId:userData._id})
    console.log('error occured')
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }
  } catch (error) {
    console.log('error from verifying payments = ',error.stack)
  }
}



const renderOrderDetails = async (req, res) => {
  try {
    const name = req.session.name;
    const userId = req.session.userId
    const orderDetails = await orderModel.find({ UserId: req.session.userId }).sort({ _id: -1 })
    const cartData = await cartModel.findOne({ userId: userId })
    let cartcount = 0
    if (cartData === null || cartData.Items == (null || 0)) {

      cartcount = 0

    } else {
      cartData.Items.forEach((cart) => {

        cartcount += cart.Quantity
      })
    }
    res.render('user/orderTracker', { title: "Zoan | Track your orders", name, orderDetails, cartcount })
  } catch (error) {
    console.error(error)
  }
}

const cancelOrderData = async (req, res) => {
  // console.log("inside cancel order route")

  try {
    const order = await orderModel.findByIdAndUpdate({ _id: req.params.orderId }, { Status: "Canceled" })
    order.Items.forEach(async (product) => {
      const P_id = product.productId
      const count = product.quantity
      await products.findByIdAndUpdate({ _id: P_id }, { $inc: { Stock: count } })
    })
    console.log("ordermodel====", order)
    res.json({
      success: true
    })
  } catch (error) {
    console.log(error)
  }
}


const orderedProduct = async (req, res) => {
  try {
    const orderId = req.params.orderId
    const userId = req.session.userId
    const orders = await orderModel.findById({ _id: orderId }).populate('Items.productId')
    const cartData = await cartModel.findOne({ userId: userId })
    let cartcount = 0
    if (cartData === null || cartData.Items == (null || 0)) {
  
      cartcount = 0
  
    } else {
      cartData.Items.forEach((cart) => {
        cartcount += cart.Quantity
      })
    }
    const name = req.session.name;
    res.render('user/order-ProductDetails', { title: "Ordered Items", name, orders, cartcount })
  } catch (error) {
      console.log('Error: ',error.message)
  }
}


const returnedItem = async (req, res) => {
  try {
    
    const productId = new mongoose.Types.ObjectId(req.body.P_id);
    const P_qty = req.body.P_qty;
    const O_id = new mongoose.Types.ObjectId(req.body.O_id);
    console.log("reached post route", productId)
    console.log(`data====P_id==${productId},P-qty=${P_qty},O_id = ${O_id}`);
    const updatedOrder = await orderModel.findOneAndUpdate(
      { _id: O_id, 'Items.productId': productId },
      { $set: { 'Items.$.removed': true } },
      { new: true }
    );
    const updateProduct = await products.findByIdAndUpdate({ _id: productId }, { $inc: { Stock: P_qty } })
    res.json({ success: true })
  } catch (error) {
      console.log('Error: ',error.message)
  }
}

module.exports = {
  checkoutUser,
  placeOrder,
  verifyOrder,
  orderSuccessPage,
  renderOrderDetails,
  cancelOrderData,
  orderedProduct,
  returnedItem
}
