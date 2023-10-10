const mongoose = require('mongoose')

const{Schema,object}=mongoose;
const imageSchema = new mongoose.Schema({
  mainimage:{
    type:String
  },image1:{
    type:String
  },
  image2:{
    type:String
  }
})
const sch = mongoose.Schema({
  Description: { type: String, required: true },
  Name: { type: String, required: true },
  Image: [{ type: String, required: true,  }],
  Rating: { type: String },
  // Specification: [{ type: String, required: true,  }],
  Stock: { type: Number, required: true },
  Stamp: { type: Date },
  Review: { type: String },
  BrandId: {type: Schema.Types.ObjectId},
  CategoryId: {type: Schema.Types.ObjectId}
})
const monmodel = mongoose.model("products",sch);

module.exports = monmodel