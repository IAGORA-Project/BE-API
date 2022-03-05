const mongoose = require('mongoose');

const Market = mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  address: String,
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'city'
  },
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product'
    }
  ],
  isAccept: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });
module.exports.Market = mongoose.model('market', Market);