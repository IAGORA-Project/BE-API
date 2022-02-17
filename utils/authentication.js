const jwt = require('jsonwebtoken')

const generateToken = (id, no_hp) => {
  const jwtSecret = process.env.JWT_SECRET
  
  const token = jwt.sign({
    jti: id,
    no_hp: no_hp,
    iat: Date.now()
  }, jwtSecret)

  return token
}

module.exports = {
  generateToken
}