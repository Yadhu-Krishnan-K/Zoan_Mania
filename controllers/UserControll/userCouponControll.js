const cartHelper = require('../../helpers/cartHelper')
const coupon = require('../../models/coupons')





const manageCoupons = async(req,res)=>{
    const cartcount = cartHelper
    const coupons = await coupon.find()
    console.log("Cpns===",coupons)
    const name = req.session.name
    res.render('user/userCoupons',{title:"Coupons",cartcount,name,coupons})
  }

const applyCoupon = async(req,res)=>{
    let code =req.body.code
    let totalAmount = req.session.totalAmount
    console.log("total Amount===",totalAmount)
    let coupons = await coupon.findOne({code:code})
    // if(coupon ==
    // console.log("check inside apply coupon====",coupons)
    if(coupons == null){
      res.json({
        success:false,
        message:'Invalid Coupon'
      })
    }else{
      if(totalAmount >= coupons.forPuchace){
        req.session.totalAmount -= coupons.discount
        let amount = req.session.totalAmount
        res.json({success:true, message:"Coupon applied", amount})
      }else{
        res.json({success:false, message:'Cannot apply this coupon'})
      }
    }
  }






module.exports = {
    manageCoupons,
    applyCoupon
}