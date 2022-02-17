const mongoose = require('mongoose');

const Product = mongoose.Schema({
    product_name: { 
        type: String,
        required: true,
        unique: true
    },
    product_category: { 
        type: String,
        required: true
    },
    product_grade: { 
        type: String,
        enum : ['A','B', 'C'],
        required: true
    },
    product_image: { 
        type: String,
        required: true
    },
    product_price: { 
        type: String,
        required: true
    },
    product_uom: { 
        type: String,
        required: true
    },
}, { versionKey: false });
module.exports.Product = mongoose.model('product', Product);