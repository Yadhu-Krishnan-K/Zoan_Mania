const cron = require('node-cron')
const category = require('../models/category');
const coupon = require('../models/coupons')
const products = require('../models/products')
const { json } = require('express');

const offerCheck = async() => {
    console.log("Checking....")

    //coupon check for expiry
    const couponCheck = await coupon.updateMany(
        {
          Expiry:{ $lte: new Date() },
          expired:false
        },
        {
          $set: {expired: true}
        }
    )



    //category check for expiry
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



      //product when category expired
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
        //updating products
      // const productCat 
      

      //when category updated checking for current category which have offer

      const updateProCat = await products.find({"catOffer.till":null})
      updateProCat.forEach(async(proCat)=>{
        let bigOffer = 0;

        proCat.Category.forEach(async(cat)=>{
          const cate = await category.findOne({catName:cat})    
          if(cate.catOffer>bigOffer){
            bigOffer = cate.catOffer
          }
        })
        if(bigOffer !== 0){
          const categor = await category.findOne({catOffer:bigOffer})
          proCat.catOffer.catName = categor.catName
          proCat.catOffer.catPer = categor.catOffer
          proCat.catOffer.till = categor.offerExpiry
          proCat.save()
        }
      })

    }
    
























 var task = cron.schedule('*/10 * * * * *',async()=>{
  try {
    await offerCheck();
  } catch (error) {
    console.error(error);
  }
})

module.exports = task