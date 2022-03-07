const { Market } = require("../../db/Market")
const { basicResponse } = require("../../utils/basic-response")
const { City } = require('../../db/City')

const getAll = async (req, res) => {
  try {
    const markets = await Market.find().where({ isAccept: true })

    return res.status(200).json(basicResponse({
      status: res.statusCode,
      message: "Success",
      result: markets
    }))
  } catch (error) {
    return res.status(500).json(basicResponse({
      status: res.statusCode,
      result: error
    }))
  }
}

const getOne = async (req, res) => {
  const { marketId } = req.params

  try {
    const market = await Market.findById(marketId)
      .where({ isAccept: true })
      .populate({
        path: 'products',
        match: {
          isAccept: true
        }
      })

    if(market) {
      return res.status(200).json(basicResponse({
        status: res.statusCode,
        message: "Success",
        result: market
      }))
    }
    
    return res.status(404).json(basicResponse({
      status: res.statusCode,
      message: "Market tidak ditemukan."
    }))
  } catch (error) {
    return res.status(500).json(basicResponse({
      status: res.statusCode,
      result: error
    }))
  }
}

const store = async (req, res) => {
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
  getAll,
  getOne,
  store
}