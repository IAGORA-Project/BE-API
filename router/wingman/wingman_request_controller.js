const { City } = require("../../db/City")
const { Market } = require("../../db/Market")
const { ProductCategory } = require("../../db/ProductCategory")
const { ProductGrade } = require("../../db/ProductGrade")
const { Product } = require("../../db/Product")
const { basicResponse } = require("../../utils/basic-response")

const requestNewProduct = async (req, res) => {
  const {
    product_name,
    product_category,
    product_grade,
    product_price,
    product_uom,
    marketId
  } = req.body
  const product_image = req.file
  const product_link_name = `https://api.iagora.id/image/product/${product_image.filename}`

  if(!product_image) {
    return res.status(422).json(basicResponse({
      status: res.statusCode,
      message: 'Gambar produk wajib diisi.'
    }))
  }

  try {
    const market = await Market.findById(marketId)
    const category = await ProductCategory.findOne({name: product_category})
    const grade = await ProductGrade.findOne({grade: product_grade})
    if(market) {
      const product = await Product.create({
        product_name,
        product_category: category._id,
        product_grade: grade._id,
        product_price,
        product_uom,
        market: market._id,
        product_image: product_link_name,
      })

      market.products.push(product)
      await market.save()

      return res.status(201).json(basicResponse({
        status: res.statusCode,
        message: "Success.",
        result: product
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

const requestNewMarket = async (req, res) => {
  const { name, address, cityId } = req.body

  try {
    const city = await City.findById(cityId)
    
    if(city) {
      const market = await Market.create({
        name, address, city: city._id
      })

      city.markets.push(market)
      await city.save()

      return res.status(201).json(basicResponse({
        status: res.statusCode,
        message: "Success.",
        result: await market.populate('city')
      }))
    }

    return res.status(404).json(basicResponse({
      status: res.statusCode,
      message: "Kota tidak ditemukan."
    }))
  } catch (error) {
    return res.status(500).json(basicResponse({
      status: res.statusCode,
      result: error
    }))
  }
}

module.exports = {
  requestNewProduct,
  requestNewMarket
}