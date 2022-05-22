const { ProductGrade } = require("../../db/ProductGrade");
const { basicResponse } = require("../../utils/basic-response");
const { isValidObjectId } = require('mongoose')

//save a grade
async function store(req, res) {
    const { grade, charge } = req.body

    try {
        const productGrade = await ProductGrade.create({ grade, charge })

        return res.status(201).json(basicResponse({
          status: res.statusCode,
          message: "Success",
          result: productGrade
        }))
    } catch (error) {
        return res.status(500).json(basicResponse({
            status: res.statusCode,
            result: error
        }))
    }
}

// update charge values of a grade based on its id
async function update(req, res) {
    const { productGradeId } = req.params
    const { charge } = req.body

    if(!isValidObjectId(productGradeId)) {
        return res.status(400).json(basicResponse({
            status: res.statusCode,
            message: "ID product grade tidak valid."
        }))
    }

    try {
        const productGrade = await ProductGrade.findById(productGradeId)

        if(productGrade) {
            productGrade.charge = charge
            await productGrade.save()

            return res.status(200).json(basicResponse({
                status: res.statusCode,
                message: "Updated",
                result: productGrade
            }))
        }

        return res.status(404).json(basicResponse({
          status: res.statusCode,
          message: "Grade produk tidak ditemukan."
        }))
    } catch (error) {
        return res.status(500).json(basicResponse({
            status: res.statusCode,
            result: error
        }))
    }
}

// get all product grades
async function getAll(req, res) {
    try {
        const productGrades = await ProductGrade.find().select('_id grade charge')

        return res.status(200).json(basicResponse({
          status: res.statusCode,
          message: "Success",
          result: productGrades
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
    update,
    getAll
}