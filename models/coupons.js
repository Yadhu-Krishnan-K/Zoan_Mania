const mongoose = require('mongoose')
    
const schema = new mongoose.Schema({
    name: String,
    code: String,
    discount: Number,
    forPuchace: Number,
    Expiry: Date,
    userId:[{type: mongoose.Schema.Types.ObjectId }],
    used:{
        type:Boolean,
        default:false
    }
     
})

const coupon = mongoose.model('Coupon',schema)
module.exports = coupon