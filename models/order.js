// import mongoose from `mongoose`;
// 
// const orederSchema = mongoose.Schema({

// })
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2')

const { Schema, ObjectId } = mongoose;

const ShippedAddressSchema = new Schema({
  Name: { type: String, required: true },
  Address: { type: String, required: true },
  Pincode: { type: String, required: true },
  City: { type: String, required: true },
  State: { type: String, required: true },
  Mobile: { type: Number, required: true },
});

const OrdersSchema = new Schema({
  UserId: { type: Schema.Types.ObjectId },
  Status: { type: String, default:"Pending"},
  //status=pending, orderplaced, shiped, delivered, rejected
  Items: [{
     productId: { type: Schema.Types.ObjectId , ref: "products" },
     quantity: { type: Number },
     returnMessage:{
      type:Array 
     },
     needToRemoved: {
      type:Boolean,
      default:false
     },
     returnStatus:{
      type: String,
      default:''
      // returned, rejected,
     },
     catOffer:[
      {
        catName: String,
        percentage: Number
      }
     ]
  }],
  PaymentMethod: {type: String},
  OrderDate: { type: String },
  
  ExpectedDeliveryDate:{type: String},

  

  TotalPrice: { type: Number },

  PaymentStatus: {type: String, default: "Pending"},
  CouponId: { type: Schema.Types.ObjectId },
  Address: { type: ShippedAddressSchema },
});

OrdersSchema.plugin(mongoosePaginate)
ShippedAddressSchema.plugin(mongoosePaginate)

const Orders = mongoose.model('Orders', OrdersSchema);

module.exports = Orders