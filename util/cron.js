const cron = require("node-cron");
const category = require("../models/category");
const coupon = require("../models/coupons");
const products = require("../models/products");
const { json } = require("express");




const catUpdate = async () => {
  // console.log("Checking....");

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



const productUpdate = async () => {
  // updating product offer at expiring, turns all to 0 and null
  const product = await products.updateMany(
    {
      "catOffer.till": { $lte: new Date() },
    },
    {
      $set: {
        "catOffer.catName": null,
        "catOffer.catPer": 0,
        "catOffer.till": null,
      },
    }
  );

  // product update when catOffer after expiring
  const updateProCat = await products.find({ "catOffer.till": null });
  for (const proCat of updateProCat) {
    let bigOffer = 0;

    for (const cat of proCat.Category) {
      const cate = await category.findOne({ catName: cat });
      if (cate.catOffer > bigOffer) {
        bigOffer = cate.catOffer;
      }
    }

    if (bigOffer !== 0) {
      const categor = await category.findOne({ catOffer: bigOffer });
      proCat.catOffer.catName = categor.catName;
      proCat.catOffer.catPer = categor.catOffer;
      proCat.catOffer.till = categor.offerExpiry;
      await proCat.save(); // Use await here to ensure sequential execution
    }
  }

  // product updating when new offer available
  const productCatOfferUpdate = await products.find();
  for (const proCat of productCatOfferUpdate) {
    let bigOffer = 0;

    for (const cat of proCat.Category) {
      const cate = await category.findOne({ catName: cat });
      // console.log("category==", cate);
      if (cate.catOffer > bigOffer) {
        bigOffer = cate.catOffer;
        // console.log('inner bigOffer==', bigOffer);
      }
    }

    // console.log('outer bigOffer==', bigOffer);

    if (bigOffer > 0) {
      const categor = await category.findOne({ catOffer: bigOffer });
      proCat.catOffer.catName = categor.catName;
      proCat.catOffer.catPer = categor.catOffer;
      proCat.catOffer.till = categor.offerExpiry;
      await proCat.save(); // Use await here to ensure sequential execution
      // console.log('procat==', proCat);
    }
  }

  // product discount prize update
  for (const proCat of productCatOfferUpdate) {
    proCat.discountedPrice = proCat.Price - (proCat.Price * proCat.catOffer.catPer / 100);
    await proCat.save(); // Use await here to ensure sequential execution
  }
};


var task = cron.schedule("*/10 * * * * *", async () => {
  try {
    await productUpdate()
    await catUpdate();
    await CouponUpdate()
  } catch (error) {
    console.error(error);
  }
});

module.exports = task;
