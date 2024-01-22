const crypto = require('crypto')

require('dotenv').config()
const Razorpay = require('razorpay');
var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });

  const createOrder = (totalPrice) => {
    try {
    
      return new Promise((resolve, reject) => {
          var options = {
              amount: totalPrice*100,  // amount in the smallest currency unit
              currency: "INR",
              receipt: "order_rcptid_11"
            };
            instance.orders.create(options, function(err, order) {
              console.log("order Created498274387dhslcnls983y9hjvcnldj===",order);
              resolve(order)
            });
      })
    
    } catch (error) {
      console.error("error 500 :",error);
    }
    
  }
  const verifyPayment = (details,orderId) => {
    try {
    
      return new Promise((resolve, reject) => {
          console.log("+++===++=-------------------------------------!!!!!!!!!!!!!!!!!!!!!!");
          console.log("details-==",details)
          console.log("orderId===",orderId)
          console.log("env.secret====",process.env.RAZORPAY_KEY_SECRET)

          let hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
          console.log(
            details.payment.razorpay_order_id +
              "|" +
              details.payment.razorpay_payment_id
          );
          hmac.update(
            details.payment.razorpay_order_id +
              "|" +
              details.payment.razorpay_payment_id
          );
      
          hmac = hmac.digest("hex");
          console.log(
            hmac,
            "hmacccccccccccccccccccccc------------------------------------------"
          );
          if (hmac === details.payment.razorpay_signature) {

            console.log("hmac success");
            // res.json({ success: true });
            resolve()
          } else {
            console.log("hmac failed");
            // res.json({ failure: true });
            reject()
          }
  
      })
    
    } catch (error) {
      console.error("error 500 :",error);
    }
    
  }

  module.exports = {
    createOrder,
    verifyPayment
}