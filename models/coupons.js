const mongoose = require('mongoose')
    
const schema = new mongoose.Schema({
    name: String,
    code: String,
    discount: Number,
    forPuchace: Number,
    Expiry: Date,
    userId:{type: Array},
     
})

const coupon = mongoose.model('Coupon',schema)
module.exports = coupon