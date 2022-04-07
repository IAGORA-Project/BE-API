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
  grandTotal: Number
}, { timestamps: true });
module.exports.Transaction = mongoose.model('transaction', Transaction);