const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  images:{type: Array},
  date: {
    type: Date,
    
  },
});

const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;