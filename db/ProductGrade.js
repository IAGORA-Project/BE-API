const mongoose = require('mongoose');

const ProductGrade = mongoose.Schema({
  grade: {
    type: String,
    required: true,
    max: 1
  },
  fee: {
    type: Number,
    required: true
  }
}, { timestamps: true });
module.exports.ProductGrade = mongoose.model('productGrade', ProductGrade);