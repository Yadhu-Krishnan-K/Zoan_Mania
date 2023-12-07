const cron = require('node-cron')
const category = require('../models/category');
const coupon = require('../models/coupons')
const { json } = require('express');

const offerCheck = async() => {
    console.log("Checking....")
    const couponCheck = await coupon.updateMany(
        {
          Expiry:{ $lte: new Date() },
          expired:false
        },
        {
          $set: {expired: true}
        }
    )
    const result = await category.updateMany(
        {
          offerExpiry: { $lte: new Date() },
          expired: false
        },
        {
          $set: { expired: true }
        }
      );
    

}

 var task = cron.schedule('*/10 * * * * *',async()=>{
  try {
    await offerCheck();
  } catch (error) {
    console.error(error);
  }
})

module.exports = task