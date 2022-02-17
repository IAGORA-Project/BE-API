const jwt = require('jsonwebtoken')
const { User } = require('../db/User')

const authUser = async (req, res, next) => {
  if(!req.headers.authorization) {
    return res.status(401).json({ fail: "Unauthorized!" })
  }

  const jwtSecret = process.env.JWT_SECRET
  const token = req.headers.authorization.split(' ')[1]

  try {
    const verify = jwt.verify(token, jwtSecret)

    if(verify) {
      const id = verify.jti

      const user = await User.findOne({ _id: id })

      if(user.auth.token === token) {
        return next()
      }

      return res.status(401).json({ fail: "Unauthorized!" })
    }

    return res.status(401).json({ fail: "Unauthorized!" })
  } catch (error) {
    return res.status(500).json(error)
  }
}

module.exports = {
  authUser
}