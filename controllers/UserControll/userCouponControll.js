const cartHelper = require('../../helpers/cartHelper')
const coupon = require('../../models/coupons')





const manageCoupons = async(req,res)=>{
  try {
    
    const cartcount = cartHelper
    const coupons = await coupon.find()
    console.log("Cpns===",coupons)
    const name = req.session.name
    res.render('user/userCoupons',{title:"Coupons",cartcount,name,coupons})
    
  } catch (error) {
    console.error("error 500 :",error);
  }
  
  }

const applyCoupon = async(req,res)=>{
  try {
    
    let code =req.body.code
    // let exist = await coupon.findOne({code:code})
  
    let totalAmount = req.session.totalAmount
    console.log("total Amount===",totalAmount)
    let coupons = await coupon.findOne({code:code})
    console.log(req.session.userId)
   
    // if(coupon ==
    // console.log("check inside apply coupon====",coupons)
    if(coupons == null){
      res.json({
        success:false,
        message:'Invalid Coupon'
      })
    }else{
      
      coupons.usedBy.forEach((id)=>{
        if(id == req.session.userId){
          return res.json({
            success:false,
            message:'Already applied'
          })
        }
      })
      if(totalAmount >= coupons.forPuchace){
        req.session.totalAmount -= coupons.discount
        let amount = req.session.totalAmount
        coupons.usedBy.push(req.session.userId)
        res.json({success:true, message:"Coupon applied", amount})
      }else{
        res.json({success:false, message:'Cannot apply this coupon'})
      }
    }
    
  } catch (error) {
    console.error("error 500 :",error);
  }
  
  }




module.exports = {
    manageCoupons,
    applyCoupon
}