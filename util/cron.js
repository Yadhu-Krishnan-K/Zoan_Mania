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


//product category expiry
const proUpdate = async () => {
  try {
    const productsToUpdate = await products.find();

    for (const product of productsToUpdate) {
      const cname = product.catOffer.catName;

      if (cname) {
        const cat = await category.findOne({ catName: cname });

        if (cat && cat.expired) {
          // Update the product using findOneAndUpdate
          const updatedProduct = await products.findOneAndUpdate(
            { _id: product._id },
            {
              $set: {
                'catOffer.catName': null,
                'catOffer.catPer': 0,
                'catOffer.till': null,
              },
            },
            { new: true } // This option returns the modified document
          );

          // if (updatedProduct) {
          //   // console.log('Product updated:', updatedProduct);
          // } else {
          //   // console.log('Failed to update product:', product);
          // }
        }
      }
    }

    // console.log('Update process completed.');
  } catch (error) {
    console.error('Error during product update:', error);
  }
};





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
      if (cate.catOffer > bigOffer && !cate.expired) {
        bigOffer = cate.catOffer;
      }
    }

    if (bigOffer !== 0) {
      const categor = await category.findOne({ catOffer: bigOffer });
      proCat.catOffer.catName = categor.catName;
      proCat.catOffer.catPer = categor.catOffer;
      proCat.catOffer.till = categor.offerExpiry;
      await proCat.save(); // Use await here to ensure sequential execution
    }else{
      const categor = await category.findOne({ catOffer: bigOffer });
      proCat.catOffer.catName = null;
      proCat.catOffer.catPer = 0;
      proCat.catOffer.till = null;
      await proCat.save();
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
    await proUpdate()
    await productUpdate()
    await catUpdate();
    await CouponUpdate()
  } catch (error) {
    console.error(error);
  }
});

module.exports = task;
