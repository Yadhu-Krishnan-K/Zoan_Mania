const cron = require("node-cron");
const category = require("../models/category");
const coupon = require("../models/coupons");
const products = require("../models/products");
const { json } = require("express");
const cart = require('../models/cartModel')




const catUpdate = async () => {

  //category check for expiry
  const result = await category.updateMany(
    {
      offerExpiry: { $lte: new Date() },
      expired: false,
    },
    {
      $set: { expired: true },
    }
  );
  // console.log('Update result:', result);
  
  const cates = await category.aggregate([
    {$match:{
      offerExpiry: { $lte: new Date() },
      expired: true,
      }
    },
  ])

  // console.log(cates)

  if (cates.length>0) {
    // Extract catName values from updated categories
    const arofupcat = cates.map((cat) => cat.catName)
    // console.log('Updated categories:', arofupcat);
      const updateResult = await products.updateMany(
        {
          'catOffer.catName': { $in: arofupcat }
        },
        {
          $set: {
            'catOffer.catName': null,
            'catOffer.catPer': 0,
            'catOffer.till': null,
          },
        }
      );
      // console.log('Products update result:', updateResult);
    
  }


};



const CouponUpdate = async()=>{
  const couponCheck = await coupon.updateMany(
    {
      Expiry: { $lte: new Date() },
      expired: false,
    },
    {
      $set: { expired: true },
    }
  );
  const couponDeletion = await coupon.deleteMany({
    Expiry: { $lte: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  });
}




//update products
  const productUpdate = async() => {
  try{
    const productCatOfferUpdate = await products.find();
    for (const proCat of productCatOfferUpdate) {
      let bigOffer = 0;
  
      for (const cat of proCat.Category) {
        const cate = await category.findOne({ catName: cat });
        if (cate && cate.catOffer > bigOffer && !cate.expired) {
          bigOffer = cate.catOffer;
        }
      }
    
      if (bigOffer > 0) {
        const categor = await category.findOne({ catOffer: bigOffer });
        proCat.catOffer.catName = categor.catName;
        proCat.catOffer.catPer = categor.catOffer;
        proCat.catOffer.till = new Date(categor.offerExpiry);
        proCat.discountedPrice = proCat.Price - (proCat.Price * proCat.catOffer.catPer / 100);
        await proCat.save(); // Use await here to ensure sequential execution
      }
    }
    
    // product discount prize update
    for (const proCat of productCatOfferUpdate) {
      proCat.discountedPrice = proCat.Price - (proCat.Price * proCat.catOffer.catPer / 100);
      await proCat.save(); // Use await here to ensure sequential execution
      // console.log('procat==', proCat);
    }
  }catch(error){
    console.error(error)
  }
}



const cartUpdate = async()=>{
  try{
      const Carts = await cart.find().populate('Items.ProductId')
      if(Carts.length>0){
        for (let cart of Carts) {
          cart.Items = cart.Items.filter(item => item.ProductId.Category.length > 0);
          await cart.save();
        }
      }
  }catch(error){
    console.error(error)
  }
}









var task = cron.schedule("*/10 * * * * *", async () => {
  try {
    // await proUpdate()
    await catUpdate();
    // await productUpdate()
    await productUpdate()
    await CouponUpdate()
    await cartUpdate()
  } catch (error) {
    console.error(error);
  }
});

module.exports = task;
