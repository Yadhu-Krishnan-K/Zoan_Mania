const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  mainImage: {
    type: String,
    required: true,
  },
  images:{type: Array},
  date: {
    type: Date,
    
  },
});

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;