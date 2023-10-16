const mongoose = require('mongoose');

const { Schema, ObjectId } = mongoose;

const CategoriesSchema = new Schema({
  catName: { type: String, required:true},

},{timestamps:true});

const Categories = mongoose.model('Categories', CategoriesSchema);

module.exports=Categories;
