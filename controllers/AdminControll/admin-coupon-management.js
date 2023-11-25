const coupons = require('../../models/coupons')
const getCoupons = async(req,res) => {
    let couponModel = await coupons.find()
    res.render('supAdmin/admin-coupons',{title:"Coupons",Page:"Coupons",couponModel})
}












module.exports = {
    getCoupons,
    
}