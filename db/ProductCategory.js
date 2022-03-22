const mongoose = require('mongoose');

const ProductCategory = mongoose.Schema({
  name: String,
  products: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product'
    }
  ]
}, { timestamps: true });
module.exports.ProductCategory = mongoose.model('productCategory', ProductCategory);