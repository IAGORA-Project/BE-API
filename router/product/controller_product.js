const { Product } = require("../../db/Product");
const { basicResponse } = require("../../utils/basic-response");

async function store(req, res) {
    try {
        const { product_name, product_category, product_grade, product_price, product_uom } = req.body;
        const product_image = req.file

        if(!product_image) {
            return res.status(422).json(basicResponse(res.statusCode, 'Gambar produk wajib diisi.'))
        }

        const create = await Product.create({ 
            product_name, 
            product_category, 
            product_grade, 
            product_image: product_image.filename, 
            product_price,
            product_uom
        });
        return res.status(201).json(basicResponse({
            status: res.statusCode,
            message: 'Produk berhasil ditambahkan.',
            result: create
        }))

    } catch (error) {
        return res.status(500).json(basicResponse({
            status: res.statusCode,
            result: error
        })); 
    }
}

async function getOne(req, res) {
    const { productId } = req.params

    try {
        const product = await Product.findById(productId).populate('market').where({ isAccept: true })

        if(product) {
            return res.status(200).json(basicResponse({
                status: res.statusCode,
                message: "Success",
                result: product
            }))
        }

        return res.status(404).json(basicResponse({
            status: res.statusCode,
            message: "Produk tidak ditemukan"
        }))
    } catch (error) {
        return res.status(500).json(basicResponse({
            status: res.statusCode,
            result: error
        }))
    }
}

async function getAll(req, res) {
    try {
        const products = await Product.find().where({ isAccept: true }).populate('market')
        
        return res.status(200).json(basicResponse({
            status: res.statusCode,
            message: "Success",
            result: products
        }))
    } catch (error) {
        return res.status(500).json(basicResponse({
            status: res.statusCode,
            result: error
        }))
    }
}

module.exports = {
    store,
    getOne,
    getAll
}