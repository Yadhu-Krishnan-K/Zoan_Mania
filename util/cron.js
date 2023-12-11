const cron = require('node-cron')
const category = require('../models/category');
const coupon = require('../models/coupons')
const products = require('../models/products')
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

      
      //deleting coupons expired after two days
      const couponDeletion = await coupon.deleteMany({ Expiry: { $lte: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) } });

      const product = await products.updateMany(
        {
          "catOffer.till": { $lte: new Date() }
        },
        {
          $set: {
            "catOffer.catName": null,
            "catOffer.catPer": 0,
            "catOffer.till": null
          }
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