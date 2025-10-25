  const mongoose = require('mongoose');

  const { Schema, ObjectId } = mongoose;

  const CategoriesSchema = new Schema({
    catName: { type: String, required:true},
    visible:{
              type:Boolean,
              default:true
            },
    catOffer:{
      type:Number,
      default:0
    },
    offerExpiry:{
      type:Date
    },
    expired:{
      type:Boolean,
      default:true
    }
  },{timestamps:true});

  const Categories = mongoose.model('Categories', CategoriesSchema);

  module.exports=Categories;