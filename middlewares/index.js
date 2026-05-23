const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const extractToken = async (req, res, next) => {
  const authorization = req.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer')) {
    req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
  } else {
    return res.status(401).json({ error: 'token missing' })
  }

  next()
}

module.exports = {
  extractToken,
}
