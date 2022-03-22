const { Product } = require("../../db/Product");
const { ProductCategory } = require("../../db/ProductCategory");
const { basicResponse } = require("../../utils/basic-response");

async function store(req, res) {
    const { name } = req.body

    try {
        const productCategory = await ProductCategory.create({ name })

        return res.status(201).json(basicResponse({
          status: res.statusCode,
          message: "Success",
          result: productCategory
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
        const productCategories = await ProductCategory.find().select('_id name')

        return res.status(200).json(basicResponse({
          status: res.statusCode,
          message: "Success",
          result: productCategories
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
    getAll
}