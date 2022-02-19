const jwt = require('jsonwebtoken')

const generateRefreshToken = (id, no_hp, url) => {
  const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET
  
  const token = jwt.sign({
    jti: id,
    no_hp,
    iss: url,
    aud: url
  }, jwtRefreshSecret, { expiresIn: '30d' })

  return token
}

module.exports = {
  generateRefreshToken
}