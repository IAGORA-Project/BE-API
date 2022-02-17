const mongoose = require('mongoose');

const Cart = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'product'
      },
      quantity: Number,
      total: Number
    }
  ]
}, { timestamps: true });
module.exports.Cart = mongoose.model('cart', Cart);