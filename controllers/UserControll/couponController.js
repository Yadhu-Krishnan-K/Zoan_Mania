const cartHelper = require('../../helpers/cartHelper.js')
const coupon = require('../../models/coupons.js')

const getCoupons = async(req, res) => {
    try {
        const cartcount = await cartHelper.cartCount(req);
        // console.log('cartcount==',cartcount)
        const coupons = await coupon.find();
        // console.log("Cpns===", coupons);
        const name = req.session.name;
        const userId = req.session.userId;
        res.render("user/userCoupon", {
            title: "Coupons",
            cartcount,
            name,
            coupons,
            userId,
        });
    } catch (error) {
        console.log('Error = ', error);
    }
}

const applyCoupon = async(req, res) => {
    try {
    let code = req.body.code;
    // let exist = await coupon.findOne({eq.code:code})

    let totalAmount = req.session.totalAmount;
    // console.log("total Amount===", totalAmount);
    let coupons = await coupon.findOne({ code: code });
    // console.log(req.session.userId);

    // if(coupon ==
    // console.log("check inside apply coupon====",coupons)
    if (coupons == null||coupons.expired) {
      res.json({
        success: false,
        message: "Invalid Coupon",
      });
    }else{
      coupons.usedBy.forEach((id) => {
        if (JSON.stringify(id) == JSON.stringify(req.session.userId)) {
          return res.json({
            success: false,
            message: "Already applied",
          });
        }
      });

      // if(coupons.usedBy.length == 0 || )
      if (totalAmount >= coupons.forPuchace) {
        req.session.totalAmount -=
          (coupons.discount * req.session.totalAmount) / 100;
        let amount = req.session.totalAmount;
        coupons.usedBy.push(req.session.userId);
        req.session.usedCoupon = true;
        req.session.couponCode = code;
        res.json({ success: true, message: "Coupon applied", amount });
      } else {
        res.json({ success: false, message: "Cannot apply this coupon" });
      }
    }
  } catch (error) {
    console.error("Error =", error);
  }
}

module.exports = {
    getCoupons,
    applyCoupon
}