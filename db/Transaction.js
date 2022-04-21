const mongoose = require('mongoose');

const Transaction = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user"
  },
  wingman: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "wingman"
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
  shippingCosts: Number,
  total: Number,
  totalHandlingFee: Number,
  recipientAddress: String,
  paidDate: {
    type: Date,
    default: undefined
  },
  completed: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });
module.exports.Transaction = mongoose.model('transaction', Transaction);