const jwt = require('jsonwebtoken')
const { basicResponse } = require('../utils/basic-response')

const accessUser = async (req, res, next) => {
  const accessToken = req.headers['x-access-token']
  
  if(!accessToken) {
    return res.status(401).json(basicResponse({
      status: res.statusCode,
      message: 'Unauthorized!'
    }))
  }
  
  const accessSecret = process.env.JWT_ACCESS_SECRET
  const token = accessToken.split(' ')[1]

  try {
    jwt.verify(token, accessSecret, (error) => {
      if(error) {
        return res.status(500).json(basicResponse({
          status: res.statusCode,
          message: "Access token error!",
          result: error
        }))
      }

      return next()
    })
  } catch (error) {
    return res.status(500).json(basicResponse({
      status: res.statusCode,
      result: error
    }))
  }
}

const refreshUser = async (req, res, next) => {
  const refreshToken = req.headers['x-refresh-token']
  
  if(!refreshToken) {
    return res.status(401).json(basicResponse({
      status: res.statusCode,
      message: 'Unauthorized!'
    }))
  }
  
  const refreshSecret = process.env.JWT_REFRESH_SECRET
  const token = refreshToken.split(' ')[1]

  try {
    jwt.verify(token, refreshSecret, (error) => {
      if(error) {
        return res.status(500).json(basicResponse({
          status: res.statusCode,
          message: "Access token error!",
          result: error
        }))
      }

      return next()
    })
  } catch (error) {
    return res.status(500).json(basicResponse({
      status: res.statusCode,
      result: error
    }))
  }
}

module.exports = {
  accessUser,
  refreshUser
}