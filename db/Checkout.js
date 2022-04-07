const mongoose = require('mongoose');

const Checkout = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  products: [
    {
      productDetail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
      },
      subTotal: Number,
      note: String,
      _id: false
    }
  ],
  tip: Number,
  total: Number,
  totalHandlingFee: Number
}, { timestamps: true });
module.exports.Checkout = mongoose.model('checkout', Checkout);