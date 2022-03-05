const mongoose = require('mongoose');

const City = mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  markets: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'market'
    }
  ]
}, { timestamps: true });
module.exports.City = mongoose.model('city', City);