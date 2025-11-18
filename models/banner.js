const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  images:{type: Array},
  date: {
    type: Date,
    
  },
  seleced:{
    type:Boolean,
    default:false
  }
});

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;