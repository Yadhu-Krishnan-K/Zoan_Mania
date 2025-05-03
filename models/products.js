const mongoose = require('mongoose')

const{Schema,object}=mongoose;
const imageSchema = new mongoose.Schema({
  mainimage:{
    type:String
  },
  image1:{
    type:String 
  },
  image2:{
    type:String
  }
})
const sch = new mongoose.Schema({
  Name: { type: String },
  Suffix:{ type: String},
  Spec1: {type: String},
  Spec2: {type: String},
  Spec3: {type: String},
  Image: [imageSchema],
  Size : {type: String},
  Description: { type: String},
  Rating: {type: String},
  // Specification: [{ type: String, required: true,  }],
  Stock: { type: Number},
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
const products = mongoose.model("products",sch);

module.exports = products