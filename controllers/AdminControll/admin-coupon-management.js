const coupons = require('../../models/coupons')



const getCoupons = async(req,res) => {
    let couponModel = await coupons.find()
    res.render('supAdmin/admin-coupons',{title:"Coupons",Page:"Coupons",couponModel})
}


const addCoupons = async(req,res)=>{
    console.log(req.body)
    let coupon = await couponsModel.create({
        name: req.body.Cname,
        code: req.body.Ccode,
        discount: req.body.Discount,
        forPuchace: req.body.PAmount,
        Expiry: req.body.Edate,
        userId:req.session.userId,
    })
    console.log("saved Data")
    if(coupon){
        res.json({
            success:true
        })
    }
}









module.exports = {
    getCoupons,
    addCoupons
}