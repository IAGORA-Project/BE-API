const { Market } = require("../../db/Market");
const { Product } = require("../../db/Product");
const { ProductCategory } = require("../../db/ProductCategory");
const { basicResponse } = require("../../utils/basic-response");

async function store(req, res) {
    const {
        product_name,
        product_category_id,
        product_grade_id,
        product_price,
        product_uom,
        marketId
    } = req.body
    const product_image = req.file

    if(!product_image) {
        return res.status(422).json(basicResponse({
            status: res.statusCode,
            message: 'Gambar produk wajib diisi.'
        }))
    }

    try {
        const market = await Market.findById(marketId)
        if(market) {
            const productCategory = await ProductCategory.findById(product_category_id)

            if(productCategory) {
                const baseUrl = `${req.protocol}://${req.hostname}${process.env.NODE_ENV === 'development' ? ':' + 5050 : ''}`
                const product = await Product.create({
                    product_name,
                    product_category: product_category_id,
                    product_grade: product_grade_id,
                    product_price,
                    product_uom,
                    market: market._id,
                    product_image: `${baseUrl}/image/product/${product_image.filename}`,
                })

                market.products.push(product)
                await market.save()

                productCategory.products.push(product)
                await productCategory.save()

                return res.status(201).json(basicResponse({
                    status: res.statusCode,
                    message: "Success.",
                    result: product
                }))
            }

            return res.status(404).json(basicResponse({
                status: res.statusCode,
                message: "Kategory product tidak ditemukan."
            }))
        }

        return res.status(404).json(basicResponse({
            status: res.statusCode,
            message: "Pasar tidak ditemukan."
        }))
    } catch (error) {
        return res.status(500).json(basicResponse({
            status: res.statusCode,
            result: error
        }))
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