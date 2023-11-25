require('dotenv').config()
const Razorpay = require('razorpay');
var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });

  const createOrder = (totalPrice) => {
    return new Promise((resolve, reject) => {
        var options = {
            amount: totalPrice*100,  // amount in the smallest currency unit
            currency: "INR",
            receipt: "order_rcptid_11"
          };
          instance.orders.create(options, function(err, order) {
            console.log(order);
            resolve(order)
          });
    })
  }
  const verifyPayment = (details,orderId) => {
    return new Promise((resolve, reject) => {
        console.log("+++===++=-------------------------------------!!!!!!!!!!!!!!!!!!!!!!");
        const crypto = require('crypto')
        // let hmac = crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET)
        let generated_signature = hmac_sha256(orderId + "|" + details['payment[razorpay_payment_id'], process.env.RAZORPAY_KEY_SECRET);
        // hmac.update(orderId+'|'+,process.env.RAZORPAY_KEY_SECRET);
        console.log("after generated signature")
        if(generated_signature == details['payment[razorpay_signature]']){
            console.log("success payment");
            resolve()
        }else{
            reject()
        }
    })
  }

  module.exports = {
    createOrder,
    verifyPayment
}