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
  Description: { type: String},
  Name: { type: String },
  Sname:{ type: String},
  Image: [imageSchema],
  Rating: {type: String},
  // Specification: [{ type: String, required: true,  }],
  Stock: { type: Number},
  Stamp: { type: Date },
  Review: { type: String }, 
  BrandId: {type: Schema.Types.ObjectId},
  CategoryId: {type: Schema.Types.ObjectId},
  Price: {type:Number}
})
const monmodel = mongoose.model("product",sch);

module.exports = monmodel