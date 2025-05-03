const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2');

const{Schema,object}=mongoose;

const sch = new mongoose.Schema({
  Name: { type: String },
  Suffix:{ type: String},
  Spec1: {type: String},
  Spec2: {type: String},
  Spec3: {type: String},
  // Image: [imageSchema],
  Image:{type: Array},
  Size : {type: String},
  Description: { type: String},
  Rating: {type: String},
  // Specification: [{ type: String, required: true,  }],
  Stock: { type: Number},
  Selled: {
          type: Number,
          default: 0
          },
  Stamp: { type: Date },
  Review: { type: String }, 
  BrandId: {type: Schema.Types.ObjectId},
  Category: {type: String},
  Price: {type:Number},
  visible:{
    type:Boolean,
    default:true
 }
},{timestamps:true}); 
sch.plugin(mongoosePaginate);
const products = mongoose.model("products",sch);

module.exports = products