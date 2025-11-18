const mongoose = require('mongoose')
    
const schema = new mongoose.Schema({
    code: {
        type:String,
        required:true
    },
    minOrderAmount:{
        type: String,
        required: true
    },
    discountType: {
        type: String,
        required: true
    },
    discountValue:{
        type: Number,
        required:true
    },
    expiry: {
        type:Date,
        required: true
    },
    usedBy:{
        type: Array,
    },
    active:{
        type: Boolean,
        required:true
    },
    expired:{
        type:Boolean,
        default:false
    }
})

const coupon = mongoose.model('coupon',schema)
module.exports = coupon