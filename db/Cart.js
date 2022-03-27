const mongoose = require('mongoose');

const Cart = mongoose.Schema({
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
      quantity: Number,
      subTotal: Number,
      handlingFee: Number,
      _id: false
    }
  ],
  total: Number,
  totalHandlingFee: Number
}, { timestamps: true });
module.exports.Cart = mongoose.model('cart', Cart);