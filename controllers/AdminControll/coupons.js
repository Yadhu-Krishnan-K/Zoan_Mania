const coupon = require("../../models/coupons")

const getCoupons = async(req,res)=>{
    try {
        let coupons = await coupon.find()
        let copiedCoupons = coupons.map((element, index, array)=>{
            let dateArr = element.expiry.toString().split(" ")
            let newDate = dateArr.slice(0,4)
            console.log('newDate = ',newDate)
            let str = newDate.join(" ")
            console.log(str)
            return {
               ...element.toObject(),
                expiry: str
            }
        })
        console.log(copiedCoupons)
        res.render('supAdmin/admin-coupons',{title:"Coupons",Page:"Coupons",coupons:copiedCoupons})
    } catch (error) {
        console.log('Error: ',error.message)
    }
}
const createCoupon = async(req,res)=>{
    try {
        const {
            dataCoupon:code, 
            dataAmount:minOrderAmount,
            dataDiscountType:discountType, 
            dataDiscountValue:value,
            dataExpiryDate:expiryDate,
            dataIsActiveCoupon:isActive
        } = req.body
        console.log(`code=${code}, discountType=${discountType}, value=${value}, 
            expiryDate=${expiryDate}, isActive=${isActive}`)
        
        const newCoupon = await coupon.create({
            code,
            discountType,
            minOrderAmount,
            discountValue:value,
            expiry:expiryDate,
            active:isActive
        })
        await newCoupon.save()
        res.status(201).json({success:true})
    } catch (error) {
        console.log('Error: ',error)
    }
}

const editCoupon = async(req, res) => {
    try {
        const {
            editingId:_id,
            dataCoupon:code, 
            dataAmount:minOrderAmount,
            dataDiscountType:discountType, 
            dataDiscountValue:value,
            dataExpiryDate:expiryDate,
            dataIsActiveCoupon:isActive
        } = req.body;
        let coupons = await coupon.updateOne({_id},{
            code,
            minOrderAmount,
            discountType,
            discountValue:value,
            expiry:expiryDate,
            active:isActive
        })
        res.status(201).json({success:true})
    } catch (error) {
        console.log('Error = ',error)
    }
}

const deleteCoupon = async(req,res)=>{
    try {
        let deleteId = req.params.id
        await coupon.findByIdAndDelete(deleteId)
        res.status(200).json({success:true})
    } catch (error) {
        console.log('Error = ',error)
    }
}
module.exports = {
    getCoupons,
    createCoupon,
    editCoupon,
    deleteCoupon
}