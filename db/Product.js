const mongoose = require('mongoose');

const Product = mongoose.Schema({
    product_name: { 
        type: String,
        required: true
    },
    product_category: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'productCategory',
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
    market: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'market'
    },
    isAccept: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });
module.exports.Product = mongoose.model('product', Product);