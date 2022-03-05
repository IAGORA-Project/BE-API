const { City } = require('../../db/City')
const { basicResponse } = require('../../utils/basic-response')

const getAll = async (req, res) => {
  try {
    const cities = await City.find()

    return res.status(200).json(basicResponse({
      status: res.statusCode,
      message: "Success",
      result: cities
    }))
  } catch (error) {
    return res.status(500).json(basicResponse({
      status: res.statusCode,
      result: error
    }))
  }
}

const store = async (req, res) => {
  const { name } = req.body

  try {
    const city = await City.create({ name })

    return res.status(201).json(basicResponse({
      status: res.statusCode,
      message: "Success.",
      result: city
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
  store
}