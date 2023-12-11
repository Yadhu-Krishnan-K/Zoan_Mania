const coupons = require('../../models/coupons')



const getCoupons = async(req,res) => {
    try {
        let couponModel = await coupons.find()
        let date = new Date()
        const formattedDate = date.toISOString().split('T')[0];
       res.render('supAdmin/admin-coupons',{title:"Coupons",Page:"Coupons",couponModel,formattedDate})
    } catch (error) {
        console.error("error 500 :",error)
    }
}


const addCoupons = async(req,res)=>{
    try {   
        let exist = await coupons.findOne({
            code:req.body.Ccode
        })
        if(exist){
            return res.json({
                success:false
            })
        }
    // console.log("exist==",exist)
        let coupon = await coupons.create({
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
    } catch (error) {
        console.error("error 500: ",error);
    }
}


const EditCoupon = async(req,res) => {
    try {
        // console.log("Edit coupon====",req.body)
        let name = req.body.Cname.trim()
        let exist = await findOne({
            code:req.body.Ccode
        })
        console.log("")
        if(exist){
            return res.json({
                success:false
            })
        }
    // Cname, Ccode, Discount, PAmount, Edate
    await coupons.findByIdAndUpdate({_id: req.params.couponId},
        {
            name:name,
            code:req.body.Ccode,
            discount:req.body.Discount,
            forPuchace:req.body.PAmount,
            Expiry:req.body.Edate,
        },{new:true}
        )
        res.json({
            success: true
        })

    } catch (error) {
        console.error("error: ",error)   
    }
}

const deleteCoupon = async(req,res) => {
    try {
        await coupons.findByIdAndDelete(req.params.couponId)
        res.json({
            success: true
        })
    } catch (error) {
        console.error("error: ",error)
    }
}







module.exports = {
    getCoupons,
    addCoupons,
    EditCoupon,
    deleteCoupon
}