// const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const { Schema, ObjectId } = mongoose;

const schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref:'user' },
    Items:[{
        ProductId:{type:Schema.Types.ObjectId, ref:'products'},
        // name: "Simsong Mobile",
        // price: 1000,
        Quantity:{type:Number,default:1},
        Price: {type: Number},
        discounted: {type: Number}
    }],
    totalAmount:{type:Number}, 
    totalQuantity:{type: Number, default: 0}
},
{timestamps:true})

const cart = mongoose.model('cartModel',schema)
module.exports=cart