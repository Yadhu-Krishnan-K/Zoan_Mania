require('dotenv').config()
const Razorpay = require('razorpay');
const crypto = require('crypto')
const createOrder = async(amount)=>{
    try {
        var razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
          })
    
          var options = {
            amount: amount*100,  // amount in the smallest currency unit
            currency: "INR",
            receipt: `order_rcptid_${new Date().getTime()}`
          };
          const resOrder = await razorpay.orders.create(options);
          return resOrder
    } catch (error) {
        console.log('Error: ',error.message)
    }
}

const expectedSignature = async(razorpay_order_id, razorpay_payment_id)=>{
    const RazorpaySecret = process.env.RAZORPAY_KEY_SECRET
      const body = razorpay_order_id + '|' + razorpay_payment_id
    
     try {
         const expSig = crypto.createHmac("sha256", RazorpaySecret)
                                         .update(body.toString())
                                         .digest("hex");

         return expSig
        
     } catch (error) {
        console.log('Error: ',error.message)
     }
        
}
    
module.exports = {
    createOrder,
    expectedSignature
}